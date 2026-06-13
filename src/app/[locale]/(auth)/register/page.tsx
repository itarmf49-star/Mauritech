"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, t } from "@/lib/i18n";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const nextPath = searchParams?.get("next") ?? `/${locale}/portal`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateClient() {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return t(locale, "authNameMin");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return t(locale, "authEmailInvalid");
    if (password.length < 8) return t(locale, "authPasswordMin");
    return null;
  }

  return (
    <section className="section auth-page">
      <Container className="auth-wrap">
        <div className="auth-card">
          <h1 className="h1 auth-title">{t(locale, "authRegisterTitle")}</h1>
          <p className="muted">{t(locale, "authRegisterDescription")}</p>

          <form
            className="auth-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              const clientError = validateClient();
              if (clientError) {
                setError(clientError);
                return;
              }

              setLoading(true);
              const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
              });
              if (!res.ok) {
                const body = (await res.json().catch(() => null)) as { error?: string } | null;
                setLoading(false);
                setError(body?.error ?? t(locale, "authRegistrationFailed"));
                return;
              }

              const signInResult = await signIn("credentials", {
                email: email.trim().toLowerCase(),
                password,
                redirect: false,
              });
              setLoading(false);

              if (signInResult?.error) {
                router.push(`/${locale}/login?next=${encodeURIComponent(nextPath)}`);
                return;
              }

              router.push(nextPath);
              router.refresh();
            }}
          >
            <label className="field">
              <span className="field-label">{t(locale, "authName")}</span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
            </label>
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
            <label className="field">
              <span className="field-label">{t(locale, "authPassword")}</span>
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
            {error ? <p className="auth-error">{error}</p> : null}
            <Button type="submit" disabled={loading}>
              {loading ? t(locale, "authCreating") : t(locale, "authCreateAccount")}
            </Button>
          </form>

          <p className="muted" style={{ marginTop: "1rem" }}>
            {t(locale, "authAlreadyHaveAccount")}{" "}
            <Link className="inline-link" href={`/${locale}/login`}>
              {t(locale, "authSignIn")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
