"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type ContactFormProps = {
  locale: Locale;
};

export function ContactForm({ locale }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <form
      className="auth-form"
      style={{ maxWidth: "36rem" }}
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              phone: phone || undefined,
              subject: subject || undefined,
              body,
            }),
          });
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          if (!res.ok) {
            setError(data.error ?? t(locale, "contactFormError"));
            return;
          }
          setDone(true);
          setBody("");
          setSubject("");
        } finally {
          setLoading(false);
        }
      }}
    >
      <label className="field">
        <span className="field-label">{t(locale, "contactFormName")}</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} autoComplete="name" />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "authEmail")}</span>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "contactFormPhone")}</span>
        <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "contactFormSubject")}</span>
        <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "contactFormMessage")}</span>
        <textarea className="textarea" rows={6} value={body} onChange={(e) => setBody(e.target.value)} required minLength={10} />
      </label>
      {error ? <p className="auth-error">{error}</p> : null}
      {done ? (
        <p className="muted" style={{ color: "var(--ok, #86efac)" }}>
          {t(locale, "contactFormSuccess")}
        </p>
      ) : null}
      <Button type="submit" disabled={loading}>
        {loading ? t(locale, "contactFormSending") : t(locale, "contactFormSubmit")}
      </Button>
    </form>
  );
}
