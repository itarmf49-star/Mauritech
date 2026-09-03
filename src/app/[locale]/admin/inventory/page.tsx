"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
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
      if (!res.ok) throw new Error(t(locale, "adminSettingsError"));
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
      if (!res.ok) throw new Error(t(locale, "adminSettingsError"));
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminInventoryManagement")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(locale, "adminInventoryHint")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalProductsCount")}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminInStockCount")}</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{stats.inStock}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminLowStockCount")}</p>
            <p className="text-3xl font-black text-yellow-400 mt-2">{stats.lowStock}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminOutOfStockCount")}</p>
            <p className="text-3xl font-black text-red-600 mt-2">{stats.outOfStock}</p>
          </div>
        </div>

        {stats.lowStock > 0 && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-yellow-400 text-sm font-medium">
              ⚠️ {t(locale, "adminLowStockWarning", { count: stats.lowStock })}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <input
            className="input-light flex-1"
            placeholder={t(locale, "adminSearchInventory")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {loading && <p className="text-gray-500">{t(locale, "adminLoadingInventory")}</p>}

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminProductName")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminProductSku")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminQty")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminReserved")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminAvailable")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminAlertThreshold")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminActionsCol")}</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const available = item.quantity - item.reservedQty;
                  const isLow = available <= item.lowStockThreshold;
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{item.product.name}</div>
                        <div className="text-gray-400 text-xs">{item.product.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{item.product.sku || "-"}</td>
                      <td className={`px-4 py-3 font-bold ${isLow ? "text-red-600" : "text-gray-900"}`}>{item.quantity}</td>
                      <td className="px-4 py-3 text-gray-600">{item.reservedQty}</td>
                      <td className={`px-4 py-3 font-bold ${isLow ? "text-red-600" : "text-gray-900"}`}>{available}</td>
                      <td className="px-4 py-3 text-gray-500">{item.lowStockThreshold}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center"
                            onClick={() => void updateStock(item.productId, -1)}
                            disabled={updating === item.productId || item.quantity <= 0}
                          >
                            -
                          </button>
                          <span className="text-gray-900 font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center"
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
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t(locale, "adminNoInventoryItems")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
