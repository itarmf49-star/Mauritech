"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/admin-ui/image-upload";
import { MultiVideoUpload } from "@/components/admin-ui/video-upload";
import { slugify } from "@/lib/slug";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Service = {
  id: string;
  slug: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  icon: string | null;
  image: string | null;
  videos: string[] | null;
  featuresFr: string[];
  featuresAr: string[];
  order: number;
  isActive: boolean;
};

const emptyForm = {
  slug: "",
  titleFr: "",
  titleAr: "",
  descriptionFr: "",
  descriptionAr: "",
  icon: "",
  image: "",
  videos: [] as string[],
  featuresFr: "",
  featuresAr: "",
  order: 0,
  isActive: true,
};

export default function AdminServicesPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      if (!res.ok) throw new Error("تعذر تحميل الخدمات");
      const data = await res.json();
      setServices(data.services || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.isActive).length;
    const withVideo = services.filter((s) => (s.videos?.length || 0) > 0).length;
    return { total, active, inactive: total - active, withVideo };
  }, [services]);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, order: services.length });
    setSlugTouched(false);
    setShowDialog(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      slug: s.slug,
      titleFr: s.titleFr,
      titleAr: s.titleAr,
      descriptionFr: s.descriptionFr || "",
      descriptionAr: s.descriptionAr || "",
      icon: s.icon || "",
      image: s.image || "",
      videos: s.videos || [],
      featuresFr: (s.featuresFr || []).join("\n"),
      featuresAr: (s.featuresAr || []).join("\n"),
      order: s.order,
      isActive: s.isActive,
    });
    setSlugTouched(true);
    setShowDialog(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        featuresFr: form.featuresFr.split("\n").map((s) => s.trim()).filter(Boolean),
        featuresAr: form.featuresAr.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      let res: Response;
      if (editing) {
        res = await fetch(`/api/admin/services/${editing.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل حفظ الخدمة");
      setShowDialog(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("فشل حذف الخدمة");
      setDeleteConfirm(null);
      return;
    }
    setDeleteConfirm(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminServices")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(locale, "adminServicesHint")}</p>
        </div>
        <button className="btn-light-primary" onClick={openAdd}>+ {t(locale, "adminAddService")}</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminServices")}</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminActiveFem")}</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminInactiveFem")}</p>
          <p className="text-3xl font-black text-gray-400 mt-2">{stats.inactive}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminServicesWithVideo")}</p>
          <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.withVideo}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
      )}
      {loading && <p className="text-gray-500 text-sm">{t(locale, "adminLoading")}</p>}

      {!loading && services.length === 0 && (
        <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-10 border border-gray-200 text-center">
          <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.828c-.293.242-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.397-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.243.437-.613.43-.992a7.66 7.66 0 0 1 0-.255c.007-.38-.138-.75-.43-.992l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <p className="text-gray-900 font-bold">{t(locale, "adminNoServicesYet")}</p>
          <p className="text-gray-500 text-sm max-w-sm">{t(locale, "adminAddFirstServiceHint")}</p>
        </div>
      )}

      {services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex flex-col shadow-sm">
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt="" className="h-32 w-full object-cover" />
              ) : (
                <div className="h-32 w-full bg-gray-50 flex items-center justify-center text-3xl">{s.icon || "🔧"}</div>
              )}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-900">{locale === "ar" ? s.titleAr : s.titleFr}</p>
                  <span className={`shrink-0 inline-flex px-2 py-1 rounded-lg border text-xs font-medium ${
                    s.isActive ? "border-emerald-500/25 text-emerald-600 bg-emerald-50" : "border-gray-200 text-gray-500 bg-gray-50"
                  }`}>
                    {s.isActive ? t(locale, "adminStatusActive") : t(locale, "adminStatusInactive")}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{s.slug}</p>
                {(locale === "ar" ? s.descriptionAr : s.descriptionFr) && (
                  <p className="text-gray-500 text-sm line-clamp-2">{locale === "ar" ? s.descriptionAr : s.descriptionFr}</p>
                )}
                {(s.videos?.length || 0) > 0 && (
                  <p className="text-[#3b82f6] text-xs font-semibold">🎬 {s.videos!.length} {t(locale, "adminVideoSuffix")}</p>
                )}
                <div className="flex gap-3 mt-auto pt-2">
                  <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(s)}>{t(locale, "adminEdit")}</button>
                  <button className="text-red-600 hover:underline text-xs" onClick={() => setDeleteConfirm(s.id)}>{t(locale, "adminDelete")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowDialog(false)}>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? t(locale, "adminEditService") : t(locale, "adminAddNewService")}</h2>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminTitleFr")}</label>
                  <input
                    className="input-light w-full"
                    value={form.titleFr}
                    onChange={(e) => {
                      const titleFr = e.target.value;
                      setForm((f) => ({ ...f, titleFr, slug: slugTouched ? f.slug : slugify(titleFr) }));
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminTitleAr")}</label>
                  <input className="input-light w-full" dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSlug")}</label>
                  <input
                    className="input-light w-full"
                    dir="ltr"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm({ ...form, slug: e.target.value });
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminIconOptional")}</label>
                  <input className="input-light w-full" placeholder="📶" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminDescriptionFr")}</label>
                  <textarea className="input-light w-full h-20" value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminDescriptionAr")}</label>
                  <textarea className="input-light w-full h-20" dir="rtl" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminServiceFeaturesFr")}</label>
                  <textarea className="input-light w-full h-24" value={form.featuresFr} onChange={(e) => setForm({ ...form, featuresFr: e.target.value })} placeholder={"Installation rapide\nSupport 24/7"} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminServiceFeaturesAr")}</label>
                  <textarea className="input-light w-full h-24" dir="rtl" value={form.featuresAr} onChange={(e) => setForm({ ...form, featuresAr: e.target.value })} placeholder={"تركيب سريع\nدعم فني ٢٤/٧"} />
                </div>
              </div>

              <ImageUpload
                folder="services"
                label={t(locale, "adminMainServiceImage")}
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
                locale={locale}
                aspect="wide"
              />

              <MultiVideoUpload
                folder="services"
                label={t(locale, "adminShowcaseVideos")}
                value={form.videos}
                onChange={(videos) => setForm({ ...form, videos })}
                locale={locale}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminDisplayOrder")}</label>
                  <input className="input-light w-full" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
                <label className="flex items-center gap-2 text-gray-700 text-sm pb-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  {t(locale, "adminActiveShowsInServices")}
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-light-primary" disabled={saving}>
                  {saving ? t(locale, "adminLoading") : t(locale, "adminSave")}
                </button>
                <button type="button" className="btn-light-secondary" onClick={() => setShowDialog(false)}>{t(locale, "adminCancel")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t(locale, "adminDelete")}</h3>
            <p className="text-gray-500 text-sm mb-4">{t(locale, "adminDeleteServiceConfirm")}</p>
            <div className="flex gap-3">
              <button className="btn-light-primary bg-red-600 hover:bg-red-700" onClick={() => handleDelete(deleteConfirm)}>{t(locale, "adminDelete")}</button>
              <button className="btn-light-secondary" onClick={() => setDeleteConfirm(null)}>{t(locale, "adminCancel")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
