import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/content";

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type SendMailResult = { ok: true } | { ok: false; reason: "not_configured" | "send_failed"; detail?: string };

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.SMTP_FROM?.trim();
  if (!host || !portRaw || !from) return null;
  const port = Number(portRaw);
  if (!Number.isFinite(port)) return null;
  return {
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
    from,
  };
}

export function isMailConfigured(): boolean {
  return getSmtpConfig() !== null;
}

export async function sendMail(message: SendMailInput): Promise<SendMailResult> {
  const cfg = getSmtpConfig();
  if (!cfg) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.auth,
    });

    await transporter.sendMail({
      from: cfg.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html ?? message.text.replace(/\n/g, "<br/>"),
    });
    return { ok: true };
  } catch (e) {
    console.error("[mail]", e);
    return {
      ok: false,
      reason: "send_failed",
      detail: e instanceof Error ? e.message : undefined,
    };
  }
}

export function getAdminNotifyEmail(): string {
  return (process.env.ADMIN_NOTIFY_EMAIL ?? siteConfig.email).trim();
}
