"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/admin-ui/image-upload";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Story = {
  id: string;
  storeId: string | null;
  type: "STORY" | "ARTICLE" | "PRODUCT_STORY";
  slug: string;
  titleFr: string;
  titleAr: string;
  coverImage: string | null;
  bodyFr: string;
  bodyAr: string;
  isPublished: boolean;
  product: { id: string; name: string; nameAr: string | null } | null;
};

type StoreOption = { id: string; nameFr: string; nameAr: string };
type ProductOption = { id: string; name: string; nameAr: string | null; storeId: string };

const emptyForm = {
  storeId: "",
  type: "STORY" as Story["type"],
  slug: "",
  titleFr: "",
  titleAr: "",
  coverImage: "",
  bodyFr: "",
  bodyAr: "",
  productId: "",
  isPublished: true,
};

export default function AdminStoriesPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [stories, setStories] = useState<Story[]>([]);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | Story["type"]>("");
  const [statusFilter, setStatusFilter] = useState<"" | "published" | "draft">("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [storiesRes, productsRes] = await Promise.all([
        fetch("/api/admin/stories", { cache: "no-store" }),
        fetch("/api/admin/products", { cache: "no-store" }),
      ]);
      const storiesData = await storiesRes.json();
      const productsData = await productsRes.json();
      if (!storiesRes.ok) throw new Error(storiesData.error || "Failed to load");
      setStories(storiesData.stories || []);
      setStores(storiesData.stores || []);
      setIsSuperAdmin(!!storiesData.isSuperAdmin);
      setProducts(productsData.products || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, storeId: stores[0]?.id || "" });
    setShowDialog(true);
  }

  function openEdit(story: Story) {
    setEditing(story);
    setForm({
      storeId: story.storeId || "",
      type: story.type,
      slug: story.slug,
      titleFr: story.titleFr,
      titleAr: story.titleAr,
      coverImage: story.coverImage || "",
      bodyFr: story.bodyFr,
      bodyAr: story.bodyAr,
      productId: story.product?.id || "",
      isPublished: story.isPublished,
    });
    setShowDialog(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, storeId: form.storeId || null, productId: form.productId || null };
      let res: Response;
      if (editing) {
        res = await fetch(`/api/admin/stories/${editing.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/stories", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
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
    const res = await fetch(`/api/admin/stories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete");
      return;
    }
    setDeleteConfirm(null);
    await load();
  }

  const typeLabel = (type: Story["type"]) =>
    type === "STORY" ? t(locale, "adminStoryTypeStory") : type === "ARTICLE" ? t(locale, "adminStoryTypeArticle") : t(locale, "adminStoryTypeProduct");

  const stats = useMemo(() => {
    const total = stories.length;
    const published = stories.filter((s) => s.isPublished).length;
    const drafts = total - published;
    const novels = stories.filter((s) => s.type === "STORY").length;
    return { total, published, drafts, novels };
  }, [stories]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stories.filter((s) => {
      if (typeFilter && s.type !== typeFilter) return false;
      if (statusFilter === "published" && !s.isPublished) return false;
      if (statusFilter === "draft" && s.isPublished) return false;
      if (q && !(s.titleFr.toLowerCase().includes(q) || s.titleAr.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [stories, search, typeFilter, statusFilter]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminStories")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t(locale, "adminStoriesHint")}</p>
          </div>
          <button className="btn-light-primary" onClick={openAdd}>{t(locale, "adminAddStory")}</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalGeneric")}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminStoryPublished")}</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{stats.published}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminDrafts")}</p>
            <p className="text-3xl font-black text-yellow-600 mt-2">{stats.drafts}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminNovelsCount")}</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.novels}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            className="input-light flex-1"
            placeholder={t(locale, "adminSearchByTitleOrSlug")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {([
              ["", t(locale, "adminAllTypes")],
              ["STORY", t(locale, "adminStoryTypeStory")],
              ["ARTICLE", t(locale, "adminStoryTypeArticle")],
              ["PRODUCT_STORY", t(locale, "adminStoryTypeProduct")],
            ] as const).map(([key, label]) => (
              <button
                key={key || "all"}
                onClick={() => setTypeFilter(key as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                  typeFilter === key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
            {([
              ["", t(locale, "portalFilterAll")],
              ["published", t(locale, "adminStoryPublished")],
              ["draft", t(locale, "adminStatusInactive")],
            ] as const).map(([key, label]) => (
              <button
                key={"status-" + (key || "all")}
                onClick={() => setStatusFilter(key as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                  statusFilter === key ? "bg-[#3b82f6] text-white border-[#3b82f6]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
        )}
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
            {stories.length === 0 ? t(locale, "adminNoStoriesFound") : t(locale, "adminNoMatchingFilterResults")}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex flex-col shadow-sm">
              {s.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.coverImage} alt="" className="h-32 w-full object-cover" />
              )}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-900">{locale === "ar" ? s.titleAr : s.titleFr}</p>
                  <span className={`shrink-0 inline-flex px-2 py-1 rounded-lg border text-xs font-medium ${
                    s.isPublished ? "border-[#F5C542]/25 text-[#F5C542] bg-[#F5C542]/5" : "border-gray-200 text-gray-500 bg-gray-50"
                  }`}>
                    {s.isPublished ? t(locale, "adminStoryPublished") : t(locale, "adminStatusInactive")}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{typeLabel(s.type)}</p>
                {s.product && (
                  <p className="text-gray-400 text-xs">{locale === "ar" && s.product.nameAr ? s.product.nameAr : s.product.name}</p>
                )}
                <p className="text-gray-400 text-sm line-clamp-2">{locale === "ar" ? s.bodyAr : s.bodyFr}</p>
                <div className="flex gap-3 mt-auto pt-2">
                  <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(s)}>{t(locale, "adminEdit")}</button>
                  <button className="text-red-600 hover:underline text-xs" onClick={() => setDeleteConfirm(s.id)}>{t(locale, "adminDelete")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowDialog(false)}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? t(locale, "adminEdit") : t(locale, "adminAddStory")}</h2>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isSuperAdmin && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreLabel")}</label>
                      <select className="input-light w-full" value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })}>
                        <option value="">{t(locale, "adminOfferPlatformWide")}</option>
                        {stores.map((s) => (
                          <option key={s.id} value={s.id}>{locale === "ar" ? s.nameAr : s.nameFr}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoryType")}</label>
                    <select className="input-light w-full" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                      <option value="STORY">{t(locale, "adminStoryTypeStory")}</option>
                      <option value="ARTICLE">{t(locale, "adminStoryTypeArticle")}</option>
                      <option value="PRODUCT_STORY">{t(locale, "adminStoryTypeProduct")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoryTitleFr")}</label>
                    <input className="input-light w-full" value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoryTitleAr")}</label>
                    <input className="input-light w-full" dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStorySlug")}</label>
                  <input className="input-light w-full" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={form.titleFr} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoryBodyFr")}</label>
                    <textarea className="input-light w-full h-32" value={form.bodyFr} onChange={(e) => setForm({ ...form, bodyFr: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoryBodyAr")}</label>
                    <textarea className="input-light w-full h-32" dir="rtl" value={form.bodyAr} onChange={(e) => setForm({ ...form, bodyAr: e.target.value })} required />
                  </div>
                </div>

                <ImageUpload
                  folder="stories"
                  label={t(locale, "adminStoryCover")}
                  value={form.coverImage}
                  onChange={(coverImage) => setForm({ ...form, coverImage })}
                  locale={locale}
                  aspect="wide"
                />

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoryProduct")}</label>
                  <select className="input-light w-full" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                    <option value="">{t(locale, "adminNoCategory")}</option>
                    {products
                      .filter((p) => !form.storeId || p.storeId === form.storeId)
                      .map((p) => (
                        <option key={p.id} value={p.id}>{locale === "ar" && p.nameAr ? p.nameAr : p.name}</option>
                      ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-gray-700 text-sm">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                  {t(locale, "adminStoryPublished")}
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
              <p className="text-gray-500 text-sm mb-4">{t(locale, "adminDeleteStoryConfirm")}</p>
              <div className="flex gap-3">
                <button className="btn-light-primary bg-red-600 hover:bg-red-700" onClick={() => handleDelete(deleteConfirm)}>{t(locale, "adminDelete")}</button>
                <button className="btn-light-secondary" onClick={() => setDeleteConfirm(null)}>{t(locale, "adminCancel")}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
