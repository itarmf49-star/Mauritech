import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PatchSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    email: z.string().email().optional(),
    phone: z.union([z.string().max(40), z.literal("")]).optional(),
    info: z.union([z.string().max(4000), z.literal("")]).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).max(200).optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword || data.confirmPassword) {
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required to set a new password",
          path: ["currentPassword"],
        });
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New passwords do not match",
          path: ["confirmPassword"],
        });
      }
    }
  });

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId || userId === "demo-admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, info: true, role: true },
    });
    if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    return NextResponse.json({ profile: user });
  } catch (e) {
    console.error("[api/portal/profile GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId || userId === "demo-admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json().catch(() => ({}));
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const body = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true },
    });
    if (!existing) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    if (body.newPassword) {
      if (!existing.password) {
        return NextResponse.json({ error: "Password login is not set for this account" }, { status: 400 });
      }
      const ok = await bcrypt.compare(body.currentPassword ?? "", existing.password);
      if (!ok) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
      }
    }

    if (body.email) {
      const nextEmail = body.email.toLowerCase().trim();
      if (nextEmail !== existing.email?.toLowerCase()) {
        const taken = await prisma.user.findUnique({
          where: { email: nextEmail },
          select: { id: true },
        });
        if (taken && taken.id !== userId) {
          return NextResponse.json({ error: "This email is already in use" }, { status: 409 });
        }
      }
    }

    const hashed = body.newPassword ? await bcrypt.hash(body.newPassword, 12) : undefined;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.email !== undefined ? { email: body.email.toLowerCase().trim() } : {}),
        ...(body.phone !== undefined ? { phone: body.phone === "" ? null : body.phone.trim() } : {}),
        ...(body.info !== undefined ? { info: body.info === "" ? null : body.info.trim() } : {}),
        ...(hashed ? { password: hashed } : {}),
      },
      select: { id: true, name: true, email: true, phone: true, info: true, role: true },
    });

    const mustReauth = Boolean(body.email || body.newPassword);

    return NextResponse.json({ profile: user, mustReauth });
  } catch (e) {
    console.error("[api/portal/profile PATCH]", e);
    return databaseUnavailableResponse();
  }
}
