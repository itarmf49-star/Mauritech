"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string | null;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: any;
};

const SHIP_STAGES = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_LABEL_KEYS: Record<string, any> = {
  PENDING: "adminPending",
  CONFIRMED: "adminConfirmed",
  PROCESSING: "adminInPrep",
  SHIPPED: "adminInTransit",
  DELIVERED: "adminDelivered",
  CANCELLED: "adminCancelled",
  REFUNDED: "adminRefunded",
};

const NEXT_STATUS: Record<string, string | null> = {
  CONFIRMED: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const NEXT_LABEL_KEYS: Record<string, any> = {
  CONFIRMED: "adminStartPrep",
  PROCESSING: "adminShipOrder",
  SHIPPED: "adminConfirmDelivery",
};

function formatAddress(addr: any): string {
  if (!addr) return "—";
  if (typeof addr === "string") return addr;
  const parts = [addr.street, addr.city, addr.region, addr.country].filter(Boolean);
  return parts.length ? parts.join("، ") : "—";
}

const statusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED": return "border-[#3b82f6]/25 text-[#3b82f6] bg-[#3b82f6]/5";
    case "PROCESSING": return "border-indigo-500/25 text-indigo-600 bg-indigo-50";
    case "SHIPPED": return "border-purple-500/25 text-purple-600 bg-purple-50";
    case "DELIVERED": return "border-green-500/25 text-emerald-600 bg-green-50";
    default: return "border-gray-200 text-gray-500 bg-white";
  }
};

export default function AdminShippingPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"pending" | "shipped" | "delivered">("pending");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!res.ok) throw new Error(t(locale, "adminSettingsError"));
      const data = await res.json();
      setOrders((data.orders || []).filter((o: Order) => SHIP_STAGES.includes(o.status)));
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
    const toPrepare = orders.filter((o) => o.status === "CONFIRMED").length;
    const processing = orders.filter((o) => o.status === "PROCESSING").length;
    const shipped = orders.filter((o) => o.status === "SHIPPED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    return { toPrepare, processing, shipped, delivered };
  }, [orders]);

  const filtered = useMemo(() => {
    if (tab === "pending") return orders.filter((o) => o.status === "CONFIRMED" || o.status === "PROCESSING");
    if (tab === "shipped") return orders.filter((o) => o.status === "SHIPPED");
    return orders.filter((o) => o.status === "DELIVERED");
  }, [orders, tab]);

  async function advance(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setUpdating(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminShippingManagement")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t(locale, "adminShippingHint")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminAwaitingPrep")}</p>
          <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.toPrepare}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminInPrep")}</p>
          <p className="text-3xl font-black text-indigo-600 mt-2">{stats.processing}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminInTransit")}</p>
          <p className="text-3xl font-black text-purple-600 mt-2">{stats.shipped}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminDelivered")}</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats.delivered}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {([
          ["pending", `${t(locale, "adminNeedsShipping")} (${stats.toPrepare + stats.processing})`],
          ["shipped", `${t(locale, "adminOnTheWay")} (${stats.shipped})`],
          ["delivered", `${t(locale, "adminDelivered")} (${stats.delivered})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
              tab === key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading && <p className="text-gray-500 text-sm">{t(locale, "adminLoading")}</p>}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminOrderNumber")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminCustomerCol")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "orderCustomerPhone")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminShippingAddress")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminTotalCol")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminStatus")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminAction")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{o.customerName}</td>
                  <td className="px-4 py-3 text-gray-500" dir="ltr">{o.customerPhone || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{formatAddress(o.shippingAddress)}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{o.total.toLocaleString()} MRU</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${statusColor(o.status)}`}>
                      {STATUS_LABEL_KEYS[o.status] ? t(locale, STATUS_LABEL_KEYS[o.status]) : o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {NEXT_STATUS[o.status] ? (
                      <button
                        className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 disabled:opacity-50"
                        disabled={updating === o.id}
                        onClick={() => void advance(o)}
                      >
                        {updating === o.id ? "..." : t(locale, NEXT_LABEL_KEYS[o.status])}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    {t(locale, "adminNoOrdersInCategory")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
