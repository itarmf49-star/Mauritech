"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, t } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <section className="section auth-page">
      <Container className="auth-wrap">
        <div className="auth-card">
          <h1 className="h1 auth-title">{t(locale, "authForgotTitle")}</h1>
          <p className="muted">{t(locale, "authForgotDescription")}</p>

          {done ? (
            <p className="muted" style={{ marginTop: "1rem" }}>
              {t(locale, "authForgotDone")}
            </p>
          ) : (
            <form
              className="auth-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                await fetch("/api/auth/forgot-password", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ email, locale }),
                });
                setLoading(false);
                setDone(true);
              }}
            >
              <label className="field">
                <span className="field-label">{t(locale, "authEmail")}</span>
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <Button type="submit" disabled={loading}>
                {loading ? t(locale, "authForgotSending") : t(locale, "authForgotSubmit")}
              </Button>
            </form>
          )}

          <p className="muted" style={{ marginTop: "1rem" }}>
            <Link className="inline-link" href={`/${locale}/login`}>
              {t(locale, "authSignIn")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
