"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  cost: number | null;
  images: string[];
  sku: string | null;
  barcode: string | null;
  isActive: boolean;
  isFeatured: boolean;
  category: { id: string; name: string } | null;
  inventory: {
    quantity: number;
    reservedQty: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  } | null;
};

type Category = { id: string; name: string; slug: string };

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  comparePrice: "",
  cost: "",
  sku: "",
  barcode: "",
  images: "",
  categoryId: "",
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
    setForm(emptyForm);
    setShowDialog(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      comparePrice: product.comparePrice?.toString() || "",
      cost: product.cost?.toString() || "",
      sku: product.sku || "",
      barcode: product.barcode || "",
      images: (product.images || []).join(", "),
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
        slug: form.slug,
        description: form.description,
        price: form.price,
        comparePrice: form.comparePrice || null,
        cost: form.cost || null,
        sku: form.sku || null,
        barcode: form.barcode || null,
        images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
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
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">إدارة المنتجات</h1>
            <p className="text-white/50 text-sm mt-1">إدارة كتالوج المنتجات والأسعار والمخزون.</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ إضافة منتج</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">إجمالي المنتجات</p>
            <p className="text-3xl font-black text-white mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">نشط</p>
            <p className="text-3xl font-black text-green-400 mt-2">{stats.active}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">مميز</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.featured}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">مخزون منخفض</p>
            <p className="text-3xl font-black text-red-400 mt-2">{stats.lowStock}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <select className="input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-white/60">Loading products...</p>}

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-bold text-white/70">Name</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Category</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Price</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Stock</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white/90">{p.name}</div>
                      <div className="text-white/40 text-xs">{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{p.category?.name || "-"}</td>
                    <td className="px-4 py-3 text-white/90 font-medium">{p.price.toLocaleString()} MRU</td>
                    <td className="px-4 py-3">
                      {p.inventory ? (
                        <span className={p.inventory.quantity <= p.inventory.lowStockThreshold ? "text-red-400" : "text-white/80"}>
                          {p.inventory.quantity}
                        </span>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg border text-xs font-medium ${
                        p.isActive ? "border-[#F5C542]/25 text-[#F5C542] bg-[#F5C542]/5" : "border-white/10 text-white/55 bg-white/5"
                      }`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(p)}>تعديل</button>
                        <button className="text-red-400 hover:underline text-xs" onClick={() => setDeleteConfirm(p.id)}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && !loading && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-white/40">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDialog(false)}>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">{editingProduct ? "تعديل منتج" : "إضافة منتج"}</h2>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Name</label>
                    <input className="input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Slug</label>
                    <input className="input w-full" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">Description</label>
                  <textarea className="input w-full h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Price (MRU)</label>
                    <input className="input w-full" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Compare Price</label>
                    <input className="input w-full" type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Cost</label>
                    <input className="input w-full" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">SKU</label>
                    <input className="input w-full" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Barcode</label>
                    <input className="input w-full" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">Images (comma-separated URLs)</label>
                  <input className="input w-full" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">Category</label>
                  <select className="input w-full" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Quantity</label>
                    <input className="input w-full" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">Low Stock Threshold</label>
                    <input className="input w-full" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-white/80 text-sm">
                    <input type="checkbox" checked={form.trackQuantity} onChange={(e) => setForm({ ...form, trackQuantity: e.target.checked })} />
                    Track Quantity
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "جارٍ الحفظ..." : editingProduct ? "تحديث المنتج" : "إنشاء منتج"}
                  </button>
                  <button type="button" className="btn" onClick={() => setShowDialog(false)}>إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-white mb-2">حذف المنتج</h3>
              <p className="text-white/60 text-sm mb-4">هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3">
                <button className="btn btn-primary bg-red-600 hover:bg-red-700" onClick={() => handleDelete(deleteConfirm)}>حذف</button>
                <button className="btn" onClick={() => setDeleteConfirm(null)}>إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
