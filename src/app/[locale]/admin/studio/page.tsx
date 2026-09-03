"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type DesignSettings = {
  primaryColor: string;
  cardRadius: number;
  glassOpacity: number;
  fontFamily: string;
  isMaintenanceMode: boolean;
};

const defaults: DesignSettings = {
  primaryColor: "#F5C542",
  cardRadius: 16,
  glassOpacity: 0.15,
  fontFamily: "Cairo",
  isMaintenanceMode: false,
};

export default function MauriStudioPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [settings, setSettings] = useState<DesignSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/design-settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSettings({ ...defaults, ...data.settings });
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/design-settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error(t(locale, "adminStudioSaveFailed"));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5C542]">MauriStudio Pro</h1>
          <p className="text-gray-400 text-sm">{t(locale, "adminStudioHint")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {success && <span className="text-emerald-600 text-sm font-bold">{t(locale, "adminStudioSaved")}</span>}
          {error && <span className="text-red-600 text-sm font-bold">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#F5C542] text-black font-bold px-6 py-2 rounded-xl hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? t(locale, "adminLoading") : t(locale, "adminStudioSaveFinal")}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-150px)]">

        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 lg:overflow-y-auto space-y-8">

          <section>
            <h2 className="font-bold mb-4 flex items-center gap-2">{t(locale, "adminStudioBrandIdentity")}</h2>
            <div className="space-y-4">
              <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-full h-10 rounded cursor-pointer" />
              <select value={settings.fontFamily} onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })} className="w-full bg-white p-3 rounded-xl border border-gray-200">
                <option>Cairo</option>
                <option>Tajawal</option>
                <option>Inter</option>
              </select>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4">{t(locale, "adminStudioCardsGlass")}</h2>
            <div className="space-y-4">
              <label className="flex justify-between text-sm">{t(locale, "adminStudioRadius")}: <span>{settings.cardRadius}px</span>
                <input type="range" min="0" max="50" value={settings.cardRadius} onChange={(e) => setSettings({ ...settings, cardRadius: Number(e.target.value) })} />
              </label>
              <label className="flex justify-between text-sm">{t(locale, "adminStudioOpacity")}: <span>{settings.glassOpacity}</span>
                <input type="range" min="0" max="1" step="0.1" value={settings.glassOpacity} onChange={(e) => setSettings({ ...settings, glassOpacity: Number(e.target.value) })} />
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4">{t(locale, "adminStudioAdvanced")}</h2>
            <button
              onClick={() => setSettings({ ...settings, isMaintenanceMode: !settings.isMaintenanceMode })}
              className={`w-full p-4 rounded-xl font-bold ${settings.isMaintenanceMode ? "bg-red-500" : "bg-green-500"}`}
            >
              {settings.isMaintenanceMode ? t(locale, "adminStudioMaintenanceOn") : t(locale, "adminStudioSiteNormal")}
            </button>
          </section>
        </div>

        <div className="lg:col-span-8 bg-black rounded-3xl p-6 sm:p-8 border border-gray-200 flex flex-col items-center justify-center">
          <h3 className="text-gray-300 uppercase tracking-[0.5em] mb-8">{t(locale, "adminStudioLivePreview")}</h3>

          <div
            className="w-full max-w-lg p-8 transition-all duration-300 border border-gray-200"
            style={{
              borderRadius: `${settings.cardRadius}px`,
              backgroundColor: `rgba(255, 255, 255, ${settings.glassOpacity})`,
              fontFamily: settings.fontFamily,
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: settings.primaryColor }}>{t(locale, "adminStudioStoreSample")}</h2>
            <p className="text-gray-600 mb-6">{t(locale, "adminStudioSampleDesc")}</p>
            <button className="px-6 py-2 rounded-lg text-black font-bold" style={{ backgroundColor: settings.primaryColor }}>
              {t(locale, "adminStudioSampleButton")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
