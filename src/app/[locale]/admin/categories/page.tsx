"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/admin-ui/image-upload";
import { slugify } from "@/lib/slug";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  _count?: { products: number };
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  parentId: "",
  isActive: true,
};


export default function AdminCategoriesPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("تعذر تحميل الفئات");
      const data = await res.json();
      setCategories(data.categories || []);
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
    const total = categories.length;
    const active = categories.filter((c) => c.isActive).length;
    const withProducts = categories.filter((c) => (c._count?.products || 0) > 0).length;
    const empty = total - withProducts;
    return { total, active, withProducts, empty };
  }, [categories]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [categories, search]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setShowDialog(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image: c.image || "",
      parentId: c.parentId || "",
      isActive: c.isActive,
    });
    setSlugTouched(true);
    setShowDialog(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, parentId: form.parentId || null };
      let res: Response;
      if (editing) {
        res = await fetch(`/api/categories/${editing.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل حفظ الفئة");
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
    setError(null);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "فشل حذف الفئة");
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
          <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminCategories")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(locale, "adminCategoriesHint")}</p>
        </div>
        <button className="btn-light-primary" onClick={openAdd}>+ {t(locale, "adminAddCategory")}</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminCategories")}</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminActiveFem")}</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminCategoriesWithProducts")}</p>
          <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.withProducts}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminCategoriesEmpty")}</p>
          <p className="text-3xl font-black text-yellow-600 mt-2">{stats.empty}</p>
        </div>
      </div>

      <input
        className="input-light w-full sm:max-w-sm"
        placeholder={t(locale, "adminSearchCategoryPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading && <p className="text-gray-500 text-sm">{t(locale, "adminLoading")}</p>}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-10 border border-gray-200 text-center">
          <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
          <p className="text-gray-900 font-bold">{categories.length === 0 ? t(locale, "adminNoCategoriesYet") : t(locale, "adminNoMatchingResults")}</p>
          <p className="text-gray-500 text-sm max-w-sm">
            {categories.length === 0 ? t(locale, "adminCreateFirstCategoryHint") : t(locale, "adminTryOtherSearch")}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4 shadow-sm">
              <div className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-300 text-lg font-bold">{c.name.slice(0, 1)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  <span className={`shrink-0 inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${c.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                    {c.isActive ? t(locale, "adminActiveFem") : t(locale, "adminInactiveFem")}
                  </span>
                </div>
                <p className="text-gray-400 text-xs truncate">{c.slug}</p>
                <p className="text-gray-500 text-xs mt-1">{c._count?.products ?? 0} {t(locale, "shopProductsSuffix")}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(c)}>{t(locale, "adminEdit")}</button>
                <button className="text-red-600 hover:underline text-xs" onClick={() => setDeleteConfirm(c.id)}>{t(locale, "adminDelete")}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowDialog(false)}>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? t(locale, "adminEditCategory") : t(locale, "adminAddNewCategory")}</h2>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminCategoryName")}</label>
                <input
                  className="input-light w-full"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
                  }}
                  required
                />
              </div>
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
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOptionalDesc")}</label>
                <textarea className="input-light w-full h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <ImageUpload
                folder="categories"
                label={t(locale, "adminCategoryImage")}
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
                locale={locale}
              />
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminParentCategory")}</label>
                <select className="input-light w-full" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
                  <option value="">{t(locale, "adminNoneMainCategory")}</option>
                  {categories.filter((c) => c.id !== editing?.id).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-gray-700 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                {t(locale, "adminActiveShowsInStore")}
              </label>
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
            <p className="text-gray-500 text-sm mb-4">{t(locale, "adminDeleteCategoryConfirm")}</p>
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
