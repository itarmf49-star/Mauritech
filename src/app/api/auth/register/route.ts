import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const ip = clientKeyFromRequest(req);
  if (!rateLimit(`auth:register:${ip}`, 8, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many registration attempts" }, { status: 429 });
  }

  const data = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) return NextResponse.json({ error: "Email already used" }, { status: 409 });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name.trim(),
        email,
        passwordHash,
        role: "CUSTOMER",
      },
      select: { id: true },
    });
    await prisma.clientAccount.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
  } catch (error) {
    console.error("[api/auth/register]", error);
    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
