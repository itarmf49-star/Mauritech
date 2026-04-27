import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { getAdminNotifyEmail, sendMail } from "@/lib/mail";
import { siteConfig } from "@/lib/content";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  body: z.string().min(10).max(8000),
});

export async function POST(req: Request) {
  const ip = clientKeyFromRequest(req);
  if (!rateLimit(`contact:${ip}`, 15, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message. Check required fields." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  try {
    const row = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.toLowerCase().trim(),
        phone: parsed.data.phone?.trim() || null,
        subject: parsed.data.subject?.trim() || null,
        body: parsed.data.body.trim(),
      },
    });

    const adminTo = getAdminNotifyEmail();
    const subjectLine = parsed.data.subject?.trim() || "Website contact form";
    const text = [
      `New contact message (${row.id})`,
      "",
      `From: ${parsed.data.name.trim()} <${parsed.data.email}>`,
      parsed.data.phone ? `Phone: ${parsed.data.phone}` : null,
      session?.user?.email ? `Session user: ${session.user.email}` : null,
      "",
      subjectLine,
      "",
      parsed.data.body.trim(),
      "",
      `— ${siteConfig.name} site form`,
    ]
      .filter(Boolean)
      .join("\n");

    const mail = await sendMail({
      to: adminTo,
      subject: `[${siteConfig.name}] ${subjectLine}`,
      text,
    });

    if (!mail.ok && mail.reason === "not_configured") {
      console.warn("[api/contact] Message stored; SMTP not configured — email not sent.");
    }

    return NextResponse.json(
      {
        ok: true,
        id: row.id,
        emailSent: mail.ok,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("[api/contact]", e);
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }
}
