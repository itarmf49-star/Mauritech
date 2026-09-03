"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/admin-ui/image-upload";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Offer = {
  id: string;
  storeId: string | null;
  titleFr: string;
  titleAr: string;
  bodyFr: string | null;
  bodyAr: string | null;
  bannerImage: string | null;
  discountType: "PERCENT" | "FIXED" | "NONE";
  discountValue: number | null;
  code: string | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  products: { product: { id: string; name: string; nameAr: string | null } }[];
};

type StoreOption = { id: string; nameFr: string; nameAr: string };
type ProductOption = { id: string; name: string; nameAr: string | null; storeId: string };

const emptyForm = {
  storeId: "",
  titleFr: "",
  titleAr: "",
  bodyFr: "",
  bodyAr: "",
  bannerImage: "",
  discountType: "NONE" as "PERCENT" | "FIXED" | "NONE",
  discountValue: "",
  code: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
  productIds: [] as string[],
};

export default function AdminOffersPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [offersRes, productsRes] = await Promise.all([
        fetch("/api/admin/offers", { cache: "no-store" }),
        fetch("/api/admin/products", { cache: "no-store" }),
      ]);
      const offersData = await offersRes.json();
      const productsData = await productsRes.json();
      if (!offersRes.ok) throw new Error(offersData.error || "Failed to load offers");
      setOffers(offersData.offers || []);
      setStores(offersData.stores || []);
      setIsSuperAdmin(!!offersData.isSuperAdmin);
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

  function openEdit(offer: Offer) {
    setEditing(offer);
    setForm({
      storeId: offer.storeId || "",
      titleFr: offer.titleFr,
      titleAr: offer.titleAr,
      bodyFr: offer.bodyFr || "",
      bodyAr: offer.bodyAr || "",
      bannerImage: offer.bannerImage || "",
      discountType: offer.discountType,
      discountValue: offer.discountValue?.toString() || "",
      code: offer.code || "",
      startsAt: offer.startsAt ? offer.startsAt.slice(0, 10) : "",
      endsAt: offer.endsAt ? offer.endsAt.slice(0, 10) : "",
      isActive: offer.isActive,
      productIds: offer.products.map((p) => p.product.id),
    });
    setShowDialog(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, storeId: form.storeId || null };
      let res: Response;
      if (editing) {
        res = await fetch(`/api/admin/offers/${editing.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/offers", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save offer");
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
    const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete offer");
      return;
    }
    setDeleteConfirm(null);
    await load();
  }

  function toggleProduct(id: string) {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id) ? f.productIds.filter((p) => p !== id) : [...f.productIds, id],
    }));
  }

  const discountLabel = (o: Offer) => {
    if (o.discountType === "PERCENT") return `-${o.discountValue}%`;
    if (o.discountType === "FIXED") return `-${o.discountValue} MRU`;
    return t(locale, "adminOfferDiscountNone");
  };

  const storeName = (id: string | null) => {
    if (!id) return t(locale, "adminOfferPlatformWide");
    const s = stores.find((st) => st.id === id);
    return s ? (locale === "ar" ? s.nameAr : s.nameFr) : "-";
  };

  const offerState = (o: Offer): "active" | "expired" | "scheduled" | "inactive" => {
    if (!o.isActive) return "inactive";
    const now = Date.now();
    if (o.endsAt && new Date(o.endsAt).getTime() < now) return "expired";
    if (o.startsAt && new Date(o.startsAt).getTime() > now) return "scheduled";
    return "active";
  };

  const stats = useMemo(() => {
    const total = offers.length;
    const active = offers.filter((o) => offerState(o) === "active").length;
    const scheduled = offers.filter((o) => offerState(o) === "scheduled").length;
    const expired = offers.filter((o) => offerState(o) === "expired").length;
    return { total, active, scheduled, expired };
  }, [offers]);

  const STATE_BADGE: Record<string, string> = {
    active: "border-emerald-500/25 text-emerald-600 bg-emerald-50",
    expired: "border-red-500/25 text-red-600 bg-red-50",
    scheduled: "border-[#3b82f6]/25 text-[#3b82f6] bg-[#3b82f6]/5",
    inactive: "border-gray-200 text-gray-500 bg-gray-50",
  };

  const STATE_LABEL: Record<string, string> = {
    active: t(locale, "adminStatusActive"),
    expired: t(locale, "offerStateExpired"),
    scheduled: t(locale, "offerStateScheduled"),
    inactive: t(locale, "adminStatusInactive"),
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminOffers")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t(locale, "adminOffersHint")}</p>
          </div>
          <button className="btn-light-primary" onClick={openAdd}>{t(locale, "adminAddOffer")}</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalOffers")}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminActiveOffers")}</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{stats.active}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminScheduledOffers")}</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.scheduled}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminExpiredOffers")}</p>
            <p className="text-3xl font-black text-red-600 mt-2">{stats.expired}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
        )}
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}

        {!loading && offers.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
            {t(locale, "adminNoOffers")}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((o) => (
            <div key={o.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex flex-col shadow-sm">
              {o.bannerImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.bannerImage} alt="" className="h-32 w-full object-cover" />
              )}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-900">{locale === "ar" ? o.titleAr : o.titleFr}</p>
                  <span className={`shrink-0 inline-flex px-2 py-1 rounded-lg border text-xs font-medium ${STATE_BADGE[offerState(o)]}`}>
                    {STATE_LABEL[offerState(o)]}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{storeName(o.storeId)}</p>
                <p className="text-[#3b82f6] font-bold text-sm">{discountLabel(o)}</p>
                {o.code && <p className="text-gray-500 text-xs">{t(locale, "adminOfferCode")}: <b className="text-gray-900">{o.code}</b></p>}
                <p className="text-gray-400 text-xs">{o.products.length} {t(locale, "adminOfferProducts")}</p>
                <div className="flex gap-3 mt-auto pt-2">
                  <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(o)}>{t(locale, "adminEdit")}</button>
                  <button className="text-red-600 hover:underline text-xs" onClick={() => setDeleteConfirm(o.id)}>{t(locale, "adminDelete")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowDialog(false)}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? t(locale, "adminEdit") : t(locale, "adminAddOffer")}</h2>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferTitleFr")}</label>
                    <input className="input-light w-full" value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferTitleAr")}</label>
                    <input className="input-light w-full" dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferBodyFr")}</label>
                    <textarea className="input-light w-full h-24" value={form.bodyFr} onChange={(e) => setForm({ ...form, bodyFr: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferBodyAr")}</label>
                    <textarea className="input-light w-full h-24" dir="rtl" value={form.bodyAr} onChange={(e) => setForm({ ...form, bodyAr: e.target.value })} />
                  </div>
                </div>

                <ImageUpload
                  folder="offers"
                  label={t(locale, "adminOfferBanner")}
                  value={form.bannerImage}
                  onChange={(bannerImage) => setForm({ ...form, bannerImage })}
                  locale={locale}
                  aspect="wide"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferDiscountType")}</label>
                    <select className="input-light w-full" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}>
                      <option value="NONE">{t(locale, "adminOfferDiscountNone")}</option>
                      <option value="PERCENT">{t(locale, "adminOfferDiscountPercent")}</option>
                      <option value="FIXED">{t(locale, "adminOfferDiscountFixed")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferValue")}</label>
                    <input className="input-light w-full" type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} disabled={form.discountType === "NONE"} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferCode")}</label>
                    <input className="input-light w-full" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferStartsAt")}</label>
                    <input className="input-light w-full" type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferEndsAt")}</label>
                    <input className="input-light w-full" type="date" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminOfferProducts")}</label>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 p-2 space-y-1">
                    {products
                      .filter((p) => !form.storeId || p.storeId === form.storeId)
                      .map((p) => (
                        <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50">
                          <input type="checkbox" checked={form.productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                          {locale === "ar" && p.nameAr ? p.nameAr : p.name}
                        </label>
                      ))}
                    {products.length === 0 && <p className="text-gray-400 text-xs px-2 py-1">{t(locale, "adminNoProductsFound")}</p>}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-gray-700 text-sm">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  {t(locale, "adminStatusActive")}
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
              <p className="text-gray-500 text-sm mb-4">{t(locale, "adminDeleteOfferConfirm")}</p>
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
