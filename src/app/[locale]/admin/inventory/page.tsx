"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Inventory = {
  id: string;
  productId: string;
  quantity: number;
  reservedQty: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  lastRestocked: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    price: number;
    images: string[];
    isActive: boolean;
  };
};

export default function AdminInventoryPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/admin/inventory${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load inventory");
      const data = await res.json();
      setInventory(data.inventory || []);
      setStats(data.stats || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => load(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function updateStock(productId: string, delta: number) {
    setUpdating(productId);
    try {
      const item = inventory.find((i) => i.productId === productId);
      if (!item) return;
      const newQty = Math.max(0, item.quantity + delta);
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
      if (!res.ok) throw new Error("Failed to update stock");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory</h1>
          <p className="text-white/50 text-sm mt-1">Monitor stock levels and manage inventory.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Total Products</p>
            <p className="text-3xl font-black text-white mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">In Stock</p>
            <p className="text-3xl font-black text-green-400 mt-2">{stats.inStock}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Low Stock</p>
            <p className="text-3xl font-black text-yellow-400 mt-2">{stats.lowStock}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Out of Stock</p>
            <p className="text-3xl font-black text-red-400 mt-2">{stats.outOfStock}</p>
          </div>
        </div>

        {stats.lowStock > 0 && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-yellow-400 text-sm font-medium">
              ⚠️ {stats.lowStock} product{stats.lowStock > 1 ? "s" : ""} running low on stock. Consider restocking soon.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-white/60">Loading inventory...</p>}

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-bold text-white/70">Product</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">SKU</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Quantity</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Reserved</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Available</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Threshold</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const available = item.quantity - item.reservedQty;
                  const isLow = available <= item.lowStockThreshold;
                  return (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white/90">{item.product.name}</div>
                        <div className="text-white/40 text-xs">{item.product.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-white/70 font-mono text-xs">{item.product.sku || "-"}</td>
                      <td className={`px-4 py-3 font-bold ${isLow ? "text-red-400" : "text-white/90"}`}>{item.quantity}</td>
                      <td className="px-4 py-3 text-white/70">{item.reservedQty}</td>
                      <td className={`px-4 py-3 font-bold ${isLow ? "text-red-400" : "text-white/90"}`}>{available}</td>
                      <td className="px-4 py-3 text-white/60">{item.lowStockThreshold}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center"
                            onClick={() => void updateStock(item.productId, -1)}
                            disabled={updating === item.productId || item.quantity <= 0}
                          >
                            -
                          </button>
                          <span className="text-white/90 font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center"
                            onClick={() => void updateStock(item.productId, 1)}
                            disabled={updating === item.productId}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {inventory.length === 0 && !loading && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-white/40">No inventory items found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
