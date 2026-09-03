"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/admin-ui/image-upload";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Settings = {
  siteSettings: {
    siteName: string;
    logoUrl: string;
    logoDarkUrl: string;
    faviconUrl: string;
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
    config: Record<string, unknown>;
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
      if (!res.ok) throw new Error(t(locale, "adminSettingsError"));
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
        throw new Error(err.error || t(locale, "adminSettingsError"));
      }
      setSuccess(t(locale, "adminSettingsSaved"));
      setTimeout(() => setSuccess(null), 4000);
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

  function updateIntegration(platform: string, field: string, value: any) {
    if (!settings) return;
    setSettings({
      ...settings,
      socialIntegrations: settings.socialIntegrations.map((s) =>
        s.platform === platform ? { ...s, [field]: value } : s
      ),
    });
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

  if (loading) return <><p className="text-gray-500">{t(locale, "adminLoading")}</p></>;
  if (!settings) return <><p className="text-red-600">{t(locale, "adminSettingsError")}</p></>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminSettings")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(locale, "adminSettingsManagement")}</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 flex items-center gap-2">
            <span>✓</span> {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">{t(locale, "adminSiteLogo")}</h3>
            <p className="text-gray-400 text-xs">{t(locale, "adminSiteLogoHint")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { field: "logoUrl" as const, label: t(locale, "adminSiteLogoLight") },
                { field: "logoDarkUrl" as const, label: t(locale, "adminSiteLogoDark") },
                { field: "faviconUrl" as const, label: t(locale, "adminSiteFavicon") },
              ]).map(({ field, label }) => (
                <ImageUpload
                  key={field}
                  folder="site"
                  label={label}
                  value={settings.siteSettings[field]}
                  onChange={(url) => updateSiteSettings(field, url)}
                  fit="contain"
                  locale={locale}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t(locale, "adminSettingsSiteSettings")}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{t(locale, "adminSettingsSiteSettingsHint")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsSiteName")}</label>
                <input className="input-light w-full" value={settings.siteSettings.siteName} onChange={(e) => updateSiteSettings("siteName", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">SEO</h3>
              <p className="text-gray-400 text-xs mt-0.5">{t(locale, "adminSettingsSeoHint")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsSeoTitle")}</label>
                <input className="input-light w-full" value={settings.siteSettings.seoTitle} onChange={(e) => updateSiteSettings("seoTitle", e.target.value)} />
              </div>
              <ImageUpload
                folder="site"
                label={t(locale, "adminSettingsOgImage")}
                value={settings.siteSettings.ogImage}
                onChange={(url) => updateSiteSettings("ogImage", url)}
                locale={locale}
                aspect="wide"
              />
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsSeoDesc")}</label>
                <textarea className="input-light w-full h-20" value={settings.siteSettings.seoDesc} onChange={(e) => updateSiteSettings("seoDesc", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t(locale, "adminSettingsWhatsApp")}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{t(locale, "adminSettingsWhatsAppHint")}</p>
            </div>
            {settings.socialIntegrations.filter((s) => s.platform === "WHATSAPP").map((w) => (
              <div key={w.id} className="space-y-4">
                <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                  <input type="checkbox" checked={w.isActive} onChange={(e) => updateIntegration("WHATSAPP", "isActive", e.target.checked)} />
                  {t(locale, "adminSettingsWhatsAppEnable")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsWhatsAppPhone")}</label>
                    <input className="input-light w-full" dir="ltr" value={w.phoneNumber} onChange={(e) => updateSocial("WHATSAPP", "phoneNumber", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsWhatsAppAPI")}</label>
                    <input className="input-light w-full" type="password" value={w.apiKey} onChange={(e) => updateSocial("WHATSAPP", "apiKey", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsWhatsAppWebhook")}</label>
                    <input className="input-light w-full" value={w.webhookUrl} onChange={(e) => updateSocial("WHATSAPP", "webhookUrl", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t(locale, "adminSettingsSocialMedia")}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{t(locale, "adminSettingsSocialMediaHint")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsFacebook")}</label>
                <input className="input-light w-full" dir="ltr" value={settings.siteSettings.facebook} onChange={(e) => updateSiteSettings("facebook", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsInstagram")}</label>
                <input className="input-light w-full" dir="ltr" value={settings.siteSettings.instagram} onChange={(e) => updateSiteSettings("instagram", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsTwitter")}</label>
                <input className="input-light w-full" dir="ltr" value={settings.siteSettings.x} onChange={(e) => updateSiteSettings("x", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsYouTube")}</label>
                <input className="input-light w-full" dir="ltr" value={settings.siteSettings.youtube} onChange={(e) => updateSiteSettings("youtube", e.target.value)} />
              </div>
            </div>

            {settings.socialIntegrations.filter((s) => s.platform !== "WHATSAPP").length > 0 && (
              <div className="pt-2 border-t border-gray-100 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t(locale, "adminSettingsExtraIntegrations")}</p>
                {settings.socialIntegrations.filter((s) => s.platform !== "WHATSAPP").map((s) => (
                  <div key={s.id} className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <input type="checkbox" checked={s.isActive} onChange={(e) => updateIntegration(s.platform, "isActive", e.target.checked)} />
                      {s.platform}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsDisplayName")}</label>
                        <input className="input-light w-full" value={s.displayName} onChange={(e) => updateSocial(s.platform, "displayName", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsWhatsAppWebhook")}</label>
                        <input className="input-light w-full" value={s.webhookUrl} onChange={(e) => updateSocial(s.platform, "webhookUrl", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsWhatsAppAPI")}</label>
                        <input className="input-light w-full" type="password" value={s.apiKey} onChange={(e) => updateSocial(s.platform, "apiKey", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t(locale, "adminSettingsAIAgent")}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{t(locale, "adminSettingsAIAgentHint")}</p>
              </div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium shrink-0">
                <input type="checkbox" checked={settings.aiAgent.isActive} onChange={(e) => updateAiAgent("isActive", e.target.checked)} />
                {t(locale, "adminEnabled")}
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsAIAgentName")}</label>
                <input className="input-light w-full" value={settings.aiAgent.name} onChange={(e) => updateAiAgent("name", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminAIProvider")}</label>
                <select className="input-light w-full" value={(settings.aiAgent.config as any)?.provider || "openai"} onChange={(e) => updateAiAgent("config", { ...(settings.aiAgent.config as any), provider: e.target.value })}>
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsAIAgentModel")}</label>
                <input className="input-light w-full" value={settings.aiAgent.model} onChange={(e) => updateAiAgent("model", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsAIMaxTokens")}</label>
                <input className="input-light w-full" type="number" value={settings.aiAgent.maxTokens} onChange={(e) => updateAiAgent("maxTokens", Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsAIAgentTemperature")}</label>
                <input className="input-light w-full" type="number" step="0.1" min="0" max="2" value={settings.aiAgent.temperature} onChange={(e) => updateAiAgent("temperature", Number(e.target.value))} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSettingsAISystemPrompt")}</label>
                <textarea className="input-light w-full h-24" value={settings.aiAgent.systemPrompt} onChange={(e) => updateAiAgent("systemPrompt", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="sticky bottom-4 flex justify-end">
            <button type="submit" className="btn-light-primary shadow-lg px-8" disabled={saving}>
              {saving ? t(locale, "adminLoading") : t(locale, "adminSaveSettings")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
