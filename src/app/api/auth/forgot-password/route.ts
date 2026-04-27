import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";
import { siteConfig } from "@/lib/content";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email(),
  locale: z.enum(["en", "fr", "ar"]).optional(),
});

export async function POST(req: Request) {
  const ip = clientKeyFromRequest(req);
  if (!rateLimit(`auth:forgot:${ip}`, 10, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const locale = parsed.data.locale ?? "en";

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  // Always respond generically so addresses cannot be enumerated.
  const generic = NextResponse.json({
    ok: true,
    message: "If an account exists for this email, you will receive reset instructions shortly.",
  });

  if (!user?.password) {
    return generic;
  }

  if (!rateLimit(`auth:forgot:email:${email}`, 3, 60 * 60_000)) {
    return generic;
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { identifier: email } }).catch(() => {});
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const baseUrl = (process.env.NEXTAUTH_URL ?? siteConfig.siteUrl).replace(/\/$/, "");
  const resetUrl = `${baseUrl}/${locale}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const mail = await sendMail({
    to: email,
    subject: `${siteConfig.name} — Reset your password`,
    text: [
      `Hello,`,
      ``,
      `We received a request to reset your password for ${siteConfig.name}.`,
      `Open this link within one hour:`,
      resetUrl,
      ``,
      `If you did not request this, you can ignore this email.`,
      ``,
      `— ${siteConfig.name}`,
    ].join("\n"),
  });

  if (!mail.ok && mail.reason === "not_configured") {
    console.warn("[forgot-password] SMTP not configured; reset link not emailed:", resetUrl);
  }

  return generic;
}
