import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const BodySchema = z.object({
  token: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const ip = clientKeyFromRequest(req);
  if (!rateLimit(`auth:reset:${ip}`, 15, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
      token: parsed.data.token,
      expires: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12);

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashed },
      }),
      prisma.verificationToken.deleteMany({ where: { identifier: email } }),
    ]);
  } catch (e) {
    console.error("[reset-password]", e);
    return NextResponse.json({ error: "Could not update password" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
