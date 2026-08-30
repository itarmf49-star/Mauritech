"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Eye, EyeOff, Layout, Type, Link2, Megaphone } from "lucide-react";

interface DynamicContentManagerProps {
  locale: "fr" | "ar";
}

interface SiteContent {
  heroTitleFr: string;
  heroTitleAr: string;
  heroSubtitleFr: string;
  heroSubtitleAr: string;
  bannerTextFr: string;
  bannerTextAr: string;
  bannerVisible: boolean;
  ctaButtonFr: string;
  ctaButtonAr: string;
  ctaLink: string;
}

export function DynamicContentManager({ locale }: DynamicContentManagerProps) {
  const [content, setContent] = useState<SiteContent>({
    heroTitleFr: "",
    heroTitleAr: "",
    heroSubtitleFr: "",
    heroSubtitleAr: "",
    bannerTextFr: "",
    bannerTextAr: "",
    bannerVisible: false,
    ctaButtonFr: "",
    ctaButtonAr: "",
    ctaLink: "",
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "banner" | "cta">("hero");

  useEffect(() => {
    // Load existing content
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch("/api/admin/content");
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (response.ok) {
        alert(locale === "fr" ? "Contenu sauvegarde!" : "تم حفظ المحتوى!");
      }
    } catch (error) {
      alert(locale === "fr" ? "Erreur de sauvegarde" : "خطأ في الحفظ");
    }
    setSaving(false);
  };

  const renderHeroTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Layout className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">
          {locale === "fr" ? "Section Hero" : "قسم البطل"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Titre (Francais)" : "العنوان (الفرنسية)"}
          </label>
          <input
            type="text"
            value={content.heroTitleFr}
            onChange={(e) => setContent({ ...content, heroTitleFr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="MauriTech Solutions"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Titre (Arabe)" : "العنوان (العربية)"}
          </label>
          <input
            type="text"
            value={content.heroTitleAr}
            onChange={(e) => setContent({ ...content, heroTitleAr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="حلول MauriTech"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Sous-titre (Francais)" : "العنوان الفرعي (الفرنسية)"}
          </label>
          <textarea
            value={content.heroSubtitleFr}
            onChange={(e) => setContent({ ...content, heroSubtitleFr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows={3}
            placeholder="Vos solutions reseau professionnelles"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Sous-titre (Arabe)" : "العنوان الفرعي (العربية)"}
          </label>
          <textarea
            value={content.heroSubtitleAr}
            onChange={(e) => setContent({ ...content, heroSubtitleAr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows={3}
            placeholder="حلول الشبكة الاحترافية الخاصة بك"
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );

  const renderBannerTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Megaphone className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">
          {locale === "fr" ? "Banniere" : "بانر"}
        </h3>
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-800/60 border border-yellow-500/30 rounded-lg">
        <input
          type="checkbox"
          checked={content.bannerVisible}
          onChange={(e) => setContent({ ...content, bannerVisible: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
        <label className="text-white">
          {locale === "fr" ? "Afficher la banniere" : "إظهار البانر"}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Texte de la banniere (Francais)" : "نص البانر (الفرنسية)"}
          </label>
          <input
            type="text"
            value={content.bannerTextFr}
            onChange={(e) => setContent({ ...content, bannerTextFr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Promotion speciale -20%"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Texte de la banniere (Arabe)" : "نص البانر (العربية)"}
          </label>
          <input
            type="text"
            value={content.bannerTextAr}
            onChange={(e) => setContent({ ...content, bannerTextAr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="عرض خاص -20%"
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );

  const renderCtaTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Link2 className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">
          {locale === "fr" ? "Bouton CTA" : "زر الحث على اتخاذ إجراء"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Texte du bouton (Francais)" : "نص الزر (الفرنسية)"}
          </label>
          <input
            type="text"
            value={content.ctaButtonFr}
            onChange={(e) => setContent({ ...content, ctaButtonFr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Demander un devis"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Texte du bouton (Arabe)" : "نص الزر (العربية)"}
          </label>
          <input
            type="text"
            value={content.ctaButtonAr}
            onChange={(e) => setContent({ ...content, ctaButtonAr: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="اطلب عرض سعر"
            dir="rtl"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Lien du bouton" : "رابط الزر"}
          </label>
          <input
            type="text"
            value={content.ctaLink}
            onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="/contact"
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "hero" as const, icon: Layout, label: locale === "fr" ? "Hero" : "البطل" },
    { id: "banner" as const, icon: Megaphone, label: locale === "fr" ? "Banniere" : "بانر" },
    { id: "cta" as const, icon: Link2, label: "CTA" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {locale === "fr" ? "Contenu Dynamique" : "المحتوى الديناميكي"}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={loadContent}
            className="btn btn-ghost flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {locale === "fr" ? "Actualiser" : "تحديث"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "..." : (locale === "fr" ? "Sauvegarder" : "حفظ")}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === tab.id
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-800/70 border border-yellow-500/30"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-800/60 backdrop-blur-md border border-yellow-500/30 rounded-xl p-6">
        {activeTab === "hero" && renderHeroTab()}
        {activeTab === "banner" && renderBannerTab()}
        {activeTab === "cta" && renderCtaTab()}
      </div>

      <div className="p-4 bg-slate-800/60 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-white font-medium">
              {locale === "fr" ? "Mise a jour en temps reel" : "تحديث في الوقت الفعلي"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" 
                ? "Les modifications sont appliquees instantanement sur le site public" 
                : "يتم تطبيق التغييرات فوراً على الموقع العام"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}