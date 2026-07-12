import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export async function POST(req: Request) {
  const ip = clientKeyFromRequest(req);
  let body: unknown = null;
  let email: string | null = null;

  if (!rateLimit(`auth:register:${ip}`, 8, 60 * 60_000)) {
    console.log("REGISTER BODY:", body);
    console.log("REGISTER EMAIL:", email);
    return NextResponse.json({ error: "Too many registration attempts" }, { status: 429 });
  }

  body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      fieldErrors.name?.[0] ?? fieldErrors.email?.[0] ?? fieldErrors.password?.[0] ?? "Invalid input";
    console.log("REGISTER BODY:", body);
    console.log("REGISTER EMAIL:", email);
    return NextResponse.json({ error: firstError, fields: fieldErrors }, { status: 400 });
  }

  email = parsed.data.email.toLowerCase().trim();
  try {
    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });
    if (existing) {
      console.log("REGISTER BODY:", body);
      console.log("REGISTER EMAIL:", email);
      return NextResponse.json({ error: "Email already used" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);
    const insertResult = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
      parsed.data.name.trim(),
      email,
      hashed,
      "CUSTOMER",
    );
    const createdUserId = insertResult[0]?.id;

    if (!createdUserId) {
      throw new Error("User insert did not return an id");
    }

    try {
      await prisma.clientAccount.create({
        data: { userId: createdUserId },
      });
    } catch (error) {
      const message = String(error);
      if (/table .*PortalAccount.*does not exist/i.test(message) || /relation .*PortalAccount.*does not exist/i.test(message) || /relation .*client_account.*does not exist/i.test(message) || /table .*client_account.*does not exist/i.test(message)) {
        console.warn("REGISTER: ClientAccount table missing, skipping client account creation.");
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    console.log("REGISTER BODY:", body);
    console.log("REGISTER EMAIL:", email);
    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }

  console.log("REGISTER BODY:", body);
  console.log("REGISTER EMAIL:", email);
  return NextResponse.json({ ok: true }, { status: 201 });
}
