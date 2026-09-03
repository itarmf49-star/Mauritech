"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { MultiImageUpload } from "@/components/admin-ui/image-upload";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

/** توليد SKU/باركود عشوائيين قابلين للتعديل يدوياً — بدل إجبار المستخدم على كتابتهما في كل مرة. */
function generateSku(seed?: string) {
  const base = (seed || "PRD").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase() || "PRD";
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${base}-${suffix}`;
}

function generateBarcode() {
  // باركود رقمي بنمط EAN-13-like مبسّط (13 رقماً)، كافٍ للاستخدام الداخلي.
  let code = "";
  for (let i = 0; i < 13; i++) code += Math.floor(Math.random() * 10);
  return code;
}

type Product = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string;
  descriptionAr: string | null;
  price: number;
  comparePrice: number | null;
  cost: number | null;
  images: string[];
  sku: string | null;
  barcode: string | null;
  isActive: boolean;
  isFeatured: boolean;
  storeId: string;
  category: { id: string; name: string } | null;
  inventory: {
    quantity: number;
    reservedQty: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  } | null;
};

type Category = { id: string; name: string; slug: string };
type StoreOption = { id: string; nameFr: string; nameAr: string };

const emptyForm = {
  name: "",
  nameAr: "",
  slug: "",
  description: "",
  descriptionAr: "",
  price: 0,
  comparePrice: "",
  cost: "",
  sku: "",
  barcode: "",
  images: [] as string[],
  categoryId: "",
  storeId: "",
  isActive: true,
  isFeatured: false,
  quantity: 0,
  lowStockThreshold: 5,
  trackQuantity: true,
};

export default function AdminProductsPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      if (categoryFilter) qs.set("categoryId", categoryFilter);
      const res = await fetch(`/api/admin/products?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setStores(data.stores || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [categoryFilter]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive).length;
    const featured = products.filter((p) => p.isFeatured).length;
    const lowStock = products.filter(
      (p) => p.inventory && p.inventory.quantity <= p.inventory.lowStockThreshold
    ).length;
    return { total, active, featured, lowStock };
  }, [products]);

  function openAdd() {
    setEditingProduct(null);
    setForm({ ...emptyForm, storeId: stores[0]?.id || "", sku: generateSku(), barcode: generateBarcode() });
    setShowDialog(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      nameAr: product.nameAr || "",
      slug: product.slug,
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      storeId: product.storeId,
      price: product.price,
      comparePrice: product.comparePrice?.toString() || "",
      cost: product.cost?.toString() || "",
      sku: product.sku || "",
      barcode: product.barcode || "",
      images: product.images || [],
      categoryId: product.category?.id || "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      quantity: product.inventory?.quantity || 0,
      lowStockThreshold: product.inventory?.lowStockThreshold || 5,
      trackQuantity: product.inventory?.trackQuantity ?? true,
    });
    setShowDialog(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        name: form.name,
        nameAr: form.nameAr || null,
        slug: form.slug,
        description: form.description,
        descriptionAr: form.descriptionAr || null,
        storeId: form.storeId || undefined,
        price: form.price,
        comparePrice: form.comparePrice || null,
        cost: form.cost || null,
        sku: form.sku || null,
        barcode: form.barcode || null,
        images: form.images,
        categoryId: form.categoryId || null,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        trackQuantity: form.trackQuantity,
        quantity: form.quantity,
        lowStockThreshold: form.lowStockThreshold,
      };

      let res: Response;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save product");
      }

      setShowDialog(false);
      setEditingProduct(null);
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete product");
      return;
    }
    setDeleteConfirm(null);
    await load();
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminProductManagement")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t(locale, "adminProductCatalogHint")}</p>
          </div>
          <button className="btn-light-primary" onClick={openAdd}>+ {t(locale, "adminAddProduct")}</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalProducts")}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminActive")}</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{stats.active}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminFeaturedCount")}</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.featured}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminLowStock")}</p>
            <p className="text-3xl font-black text-red-500 mt-2">{stats.lowStock}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input-light flex-1"
            placeholder={t(locale, "adminSearchProducts")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <select className="input-light" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">{t(locale, "adminAllCategoriesFilter")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
        )}
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}

        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-bold text-gray-500">{t(locale, "adminProductName")}</th>
                  {stores.length > 1 && <th className="px-4 py-3 text-left font-bold text-gray-500">{t(locale, "adminStoreLabel")}</th>}
                  <th className="px-4 py-3 text-left font-bold text-gray-500">{t(locale, "adminProductCategory")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500">{t(locale, "adminProductPrice")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500">{t(locale, "adminProductStock")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500">{t(locale, "adminProductStatus")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500">{t(locale, "adminProductActions")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{locale === "ar" && p.nameAr ? p.nameAr : p.name}</div>
                      <div className="text-gray-400 text-xs">{p.slug}</div>
                    </td>
                    {stores.length > 1 && (
                      <td className="px-4 py-3 text-gray-600">
                        {(() => {
                          const s = stores.find((st) => st.id === p.storeId);
                          return s ? (locale === "ar" ? s.nameAr : s.nameFr) : "-";
                        })()}
                      </td>
                    )}
                    <td className="px-4 py-3 text-gray-600">{p.category?.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{p.price.toLocaleString()} MRU</td>
                    <td className="px-4 py-3">
                      {p.inventory ? (
                        <span className={p.inventory.quantity <= p.inventory.lowStockThreshold ? "text-red-500" : "text-gray-700"}>
                          {p.inventory.quantity}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg border text-xs font-medium ${
                        p.isActive ? "border-[#F5C542]/25 text-[#F5C542] bg-[#F5C542]/5" : "border-gray-200 text-gray-500 bg-gray-50"
                      }`}>
                        {p.isActive ? t(locale, "adminStatusActive") : t(locale, "adminStatusInactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(p)}>{t(locale, "adminEdit")}</button>
                        <button className="text-red-600 hover:underline text-xs" onClick={() => setDeleteConfirm(p.id)}>{t(locale, "adminDelete")}</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && !loading && (
                  <tr>
                    <td colSpan={stores.length > 1 ? 7 : 6} className="px-4 py-12">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" />
                          </svg>
                        </div>
                        <p className="text-gray-900 font-bold">{t(locale, "adminNoProductsFound")}</p>
                        <p className="text-gray-500 text-sm max-w-sm">{t(locale, "adminNoProductsHint")}</p>
                        <button className="btn-light-primary mt-1" onClick={openAdd}>+ {t(locale, "adminAddProduct")}</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDialog(false)}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editingProduct ? t(locale, "adminEditProduct") : t(locale, "adminAddProduct")}</h2>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                {stores.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreLabel")}</label>
                    <select className="input-light w-full" value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })} required>
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>{locale === "ar" ? s.nameAr : s.nameFr}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminNameFr")}</label>
                    <input className="input-light w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminNameAr")}</label>
                    <input className="input-light w-full" dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminSlug")}</label>
                  <input className="input-light w-full" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminDescriptionFr")}</label>
                    <textarea className="input-light w-full h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminDescriptionAr")}</label>
                    <textarea className="input-light w-full h-20" dir="rtl" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminProductPrice")} (MRU)</label>
                    <input className="input-light w-full" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminComparePrice")}</label>
                    <input className="input-light w-full" type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminCost")}</label>
                    <input className="input-light w-full" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminProductSKU")}</label>
                    <div className="flex gap-2">
                      <input className="input-light w-full" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder={t(locale, "adminAutoGeneratedPlaceholder")} />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, sku: generateSku(f.name) }))}
                        className="shrink-0 h-9 w-9 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500"
                        title={t(locale, "adminAutoGenerateTitle")}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminProductBarcode")}</label>
                    <div className="flex gap-2">
                      <input className="input-light w-full" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder={t(locale, "adminAutoGeneratedPlaceholder")} />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, barcode: generateBarcode() }))}
                        className="shrink-0 h-9 w-9 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500"
                        title={t(locale, "adminAutoGenerateTitle")}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <MultiImageUpload
                  folder="products"
                  label={t(locale, "adminImages")}
                  value={form.images}
                  onChange={(images) => setForm({ ...form, images })}
                  locale={locale}
                />
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminProductCategory")}</label>
                  <select className="input-light w-full" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">{t(locale, "adminNoCategory")}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminInventoryQuantity")}</label>
                    <input className="input-light w-full" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminInventoryThreshold")}</label>
                    <input className="input-light w-full" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    {t(locale, "adminActive")}
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                    {t(locale, "adminProductFeatured")}
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" checked={form.trackQuantity} onChange={(e) => setForm({ ...form, trackQuantity: e.target.checked })} />
                    {t(locale, "adminTrackQuantity")}
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t(locale, "adminDeleteProduct")}</h3>
              <p className="text-gray-500 text-sm mb-4">{t(locale, "adminDeleteProductConfirm")}</p>
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
