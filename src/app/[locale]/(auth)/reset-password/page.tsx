"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, t } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const token = search?.get("token") ?? "";
  const email = search?.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalidLink = !token || !email;

  return (
    <section className="section auth-page">
      <Container className="auth-wrap">
        <div className="auth-card">
          <h1 className="h1 auth-title">{t(locale, "authResetTitle")}</h1>
          <p className="muted">{t(locale, "authResetDescription")}</p>

          {invalidLink ? (
            <p className="auth-error" style={{ marginTop: "1rem" }}>
              {t(locale, "authResetInvalid")}
            </p>
          ) : (
            <form
              className="auth-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                if (password !== confirm) {
                  setError(t(locale, "authPasswordMismatch"));
                  return;
                }
                setLoading(true);
                const res = await fetch("/api/auth/reset-password", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ token, email, password }),
                });
                setLoading(false);
                const body = (await res.json().catch(() => ({}))) as { error?: string };
                if (!res.ok) {
                  setError(body.error ?? t(locale, "authResetInvalid"));
                  return;
                }
                router.push(`/${locale}/login`);
              }}
            >
              <label className="field">
                <span className="field-label">{t(locale, "portalNewPassword")}</span>
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </label>
              <label className="field">
                <span className="field-label">{t(locale, "portalConfirmPassword")}</span>
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                />
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? t(locale, "authResetSaving") : t(locale, "authResetSubmit")}
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
