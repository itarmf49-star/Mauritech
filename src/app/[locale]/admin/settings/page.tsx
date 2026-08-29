"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Settings = {
  siteSettings: {
    siteName: string;
    seoTitle: string;
    seoDesc: string;
    ogImage: string;
    facebook: string;
    instagram: string;
    x: string;
    youtube: string;
  };
  aiAgent: {
    name: string;
    description: string;
    isActive: boolean;
    systemPrompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  socialIntegrations: {
    id: string;
    platform: string;
    isActive: boolean;
    webhookUrl: string;
    apiKey: string;
    phoneNumber: string;
    displayName: string;
  }[];
};

export default function AdminSettingsPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save settings");
      }
      setSuccess("Settings saved successfully");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function updateSiteSettings(field: string, value: string) {
    if (!settings) return;
    setSettings({ ...settings, siteSettings: { ...settings.siteSettings, [field]: value } });
  }

  function updateAiAgent(field: string, value: any) {
    if (!settings) return;
    setSettings({ ...settings, aiAgent: { ...settings.aiAgent, [field]: value } });
  }

  function updateSocial(platform: string, field: string, value: string) {
    if (!settings) return;
    setSettings({
      ...settings,
      socialIntegrations: settings.socialIntegrations.map((s) =>
        s.platform === platform ? { ...s, [field]: value } : s
      ),
    });
  }

  if (loading) return <AdminShell locale={locale}><p className="text-white/60">{t(locale, "adminLoading")}</p></AdminShell>;
  if (!settings) return <AdminShell locale={locale}><p className="text-red-400">{t(locale, "adminSettingsError")}</p></AdminShell>;

  return (
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{t(locale, "adminSettings")}</h1>
          <p className="text-white/50 text-sm mt-1">{t(locale, "adminSettingsManagement")}</p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <form onSubmit={handleSave} className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{t(locale, "adminSettingsSiteSettings")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsSiteName")}</label>
                <input className="input w-full" value={settings.siteSettings.siteName} onChange={(e) => updateSiteSettings("siteName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsSeoTitle")}</label>
                <input className="input w-full" value={settings.siteSettings.seoTitle} onChange={(e) => updateSiteSettings("seoTitle", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsSeoDesc")}</label>
                <textarea className="input w-full h-20" value={settings.siteSettings.seoDesc} onChange={(e) => updateSiteSettings("seoDesc", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsFacebook")}</label>
                <input className="input w-full" value={settings.siteSettings.facebook} onChange={(e) => updateSiteSettings("facebook", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsInstagram")}</label>
                <input className="input w-full" value={settings.siteSettings.instagram} onChange={(e) => updateSiteSettings("instagram", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsTwitter")}</label>
                <input className="input w-full" value={settings.siteSettings.x} onChange={(e) => updateSiteSettings("x", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsYouTube")}</label>
                <input className="input w-full" value={settings.siteSettings.youtube} onChange={(e) => updateSiteSettings("youtube", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{t(locale, "adminSettingsWhatsApp")}</h3>
            {settings.socialIntegrations.filter((s) => s.platform === "WHATSAPP").map((w) => (
              <div key={w.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsWhatsAppPhone")}</label>
                  <input className="input w-full" value={w.phoneNumber} onChange={(e) => updateSocial("WHATSAPP", "phoneNumber", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsWhatsAppAPI")}</label>
                  <input className="input w-full" type="password" value={w.apiKey} onChange={(e) => updateSocial("WHATSAPP", "apiKey", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsWhatsAppWebhook")}</label>
                  <input className="input w-full" value={w.webhookUrl} onChange={(e) => updateSocial("WHATSAPP", "webhookUrl", e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{t(locale, "adminSettingsSocialMedia")}</h3>
            {settings.socialIntegrations.filter((s) => s.platform !== "WHATSAPP").map((s) => (
              <div key={s.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">{s.platform} {t(locale, "adminSettingsSiteName")}</label>
                  <input className="input w-full" value={s.displayName} onChange={(e) => updateSocial(s.platform, "displayName", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsWhatsAppWebhook")}</label>
                  <input className="input w-full" value={s.webhookUrl} onChange={(e) => updateSocial(s.platform, "webhookUrl", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsWhatsAppAPI")}</label>
                  <input className="input w-full" type="password" value={s.apiKey} onChange={(e) => updateSocial(s.platform, "apiKey", e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{t(locale, "adminSettingsAIAgent")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsAIAgentName")}</label>
                <input className="input w-full" value={settings.aiAgent.name} onChange={(e) => updateAiAgent("name", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsAIAgentModel")}</label>
                <input className="input w-full" value={settings.aiAgent.model} onChange={(e) => updateAiAgent("model", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsAIAgentTemperature")}</label>
                <input className="input w-full" type="number" step="0.1" min="0" max="2" value={settings.aiAgent.temperature} onChange={(e) => updateAiAgent("temperature", Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsAIMaxTokens")}</label>
                <input className="input w-full" type="number" value={settings.aiAgent.maxTokens} onChange={(e) => updateAiAgent("maxTokens", Number(e.target.value))} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "adminSettingsAISystemPrompt")}</label>
                <textarea className="input w-full h-24" value={settings.aiAgent.systemPrompt} onChange={(e) => updateAiAgent("systemPrompt", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? t(locale, "adminLoading") : t(locale, "adminSaveSettings")}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
