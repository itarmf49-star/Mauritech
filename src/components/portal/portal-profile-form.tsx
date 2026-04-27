"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  info: string | null;
  role: string;
};

type PortalProfileFormProps = {
  locale: Locale;
};

export function PortalProfileForm({ locale }: PortalProfileFormProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [okMessage, setOkMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [info, setInfo] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const load = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/portal/profile", { cache: "no-store" });
    if (res.status === 401) {
      setLoadError("Session expired. Please sign in again.");
      return;
    }
    if (!res.ok) {
      setLoadError("Could not load profile.");
      return;
    }
    const data = (await res.json()) as { profile: Profile | null };
    if (!data.profile) {
      setLoadError("Profile not found.");
      return;
    }
    setProfile(data.profile);
    setName(data.profile.name ?? "");
    setEmail(data.profile.email ?? "");
    setPhone(data.profile.phone ?? "");
    setInfo(data.profile.info ?? "");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setOkMessage(null);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          info,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
          confirmPassword: confirmPassword || undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; mustReauth?: boolean; profile?: Profile };
      if (!res.ok) {
        setFormError(body.error ?? "Could not save changes.");
        return;
      }
      if (body.profile) {
        setProfile(body.profile);
        setName(body.profile.name ?? "");
        setEmail(body.profile.email ?? "");
        setPhone(body.profile.phone ?? "");
        setInfo(body.profile.info ?? "");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOkMessage(t(locale, "portalProfileSaved"));

      if (body.mustReauth) {
        await signOut({ callbackUrl: `/${locale}/login` });
        return;
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return <p className="auth-error">{loadError}</p>;
  }

  if (!profile) {
    return <p className="muted">{t(locale, "portalProfileLoading")}</p>;
  }

  return (
    <form className="auth-form portal-profile-form" onSubmit={(e) => void onSubmit(e)}>
      <h3 className="portal-card-title">{t(locale, "portalProfileSection")}</h3>
      <label className="field">
        <span className="field-label">{t(locale, "authName")}</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} autoComplete="name" />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "authEmail")}</span>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "portalProfilePhone")}</span>
        <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "portalProfileNotes")}</span>
        <textarea className="textarea" rows={3} value={info} onChange={(e) => setInfo(e.target.value)} />
      </label>

      <h3 className="portal-card-title" style={{ marginTop: "1.25rem" }}>
        {t(locale, "portalChangePassword")}
      </h3>
      <p className="muted" style={{ marginTop: 0 }}>
        {t(locale, "portalChangePasswordActive")}
      </p>
      <label className="field">
        <span className="field-label">{t(locale, "portalCurrentPassword")}</span>
        <input
          className="input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "portalNewPassword")}</span>
        <input
          className="input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
      </label>
      <label className="field">
        <span className="field-label">{t(locale, "portalConfirmPassword")}</span>
        <input
          className="input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
      </label>

      {formError ? <p className="auth-error">{formError}</p> : null}
      {okMessage ? <p className="muted" style={{ color: "var(--ok, #86efac)" }}>{okMessage}</p> : null}

      <div className="portal-actions">
        <Button type="submit" disabled={saving}>
          {saving ? t(locale, "portalSavingProfile") : t(locale, "portalSaveProfile")}
        </Button>
      </div>
    </form>
  );
}
