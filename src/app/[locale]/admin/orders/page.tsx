"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: {
    productName: string;
    productSku: string | null;
    quantity: number;
    unitPrice: number;
    total: number;
    product: { name: string; images: string[] } | null;
  }[];
  user: { name: string | null; email: string | null } | null;
  shippingAddress: any;
  billingAddress: any;
  notes: string | null;
};

const STATUS_FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function AdminOrdersPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data.orders || []);
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
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const processing = orders.filter((o) => o.status === "PROCESSING" || o.status === "CONFIRMED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    return { total, pending, processing, delivered, revenue };
  }, [orders]);

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await load();
      if (selectedOrder?.id === orderId) {
        const updated = orders.find((o) => o.id === orderId);
        if (updated) setSelectedOrder({ ...updated, status: newStatus });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdatingStatus(null);
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "border-yellow-500/25 text-yellow-400 bg-yellow-400/5";
      case "CONFIRMED": return "border-[#3b82f6]/25 text-[#3b82f6] bg-[#3b82f6]/5";
      case "PROCESSING": return "border-indigo-500/25 text-indigo-400 bg-indigo-400/5";
      case "SHIPPED": return "border-purple-500/25 text-purple-400 bg-purple-400/5";
      case "DELIVERED": return "border-green-500/25 text-green-400 bg-green-400/5";
      case "CANCELLED": return "border-red-500/25 text-red-400 bg-red-400/5";
      default: return "border-white/10 text-white/55 bg-white/5";
    }
  };

  return (
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">إدارة الطلبات</h1>
          <p className="text-white/50 text-sm mt-1">إدارة طلبات العملاء والتوصيل.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">إجمالي الطلبات</p>
            <p className="text-3xl font-black text-white mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">قيد الانتظار</p>
            <p className="text-3xl font-black text-yellow-400 mt-2">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">قيد المعالجة</p>
            <p className="text-3xl font-black text-indigo-400 mt-2">{stats.processing}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">تم التوصيل</p>
            <p className="text-3xl font-black text-green-400 mt-2">{stats.delivered}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">الإيرادات</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.revenue.toLocaleString()} MRU</p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-white/60">Loading orders...</p>}

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-bold text-white/70">رقم الطلب</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">العميل</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">الإجمالي</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">الحالة</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">التاريخ</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-bold text-white/90">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-white/70">{o.customerName}</td>
                    <td className="px-4 py-3 text-white/90 font-medium">{o.total.toLocaleString()} MRU</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => setSelectedOrder(o)}>عرض</button>
                        <select
                          className="input text-xs py-1 px-2"
                          value={o.status}
                          onChange={(e) => void updateStatus(o.id, e.target.value)}
                          disabled={updatingStatus === o.id}
                        >
                          {STATUS_FLOW.filter((s) => s === o.status || STATUS_FLOW.indexOf(s) > STATUS_FLOW.indexOf(o.status)).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-white/40">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">طلب {selectedOrder.orderNumber}</h2>
                <button className="text-white/60 hover:text-white" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">العميل</h3>
                  <p className="text-white/80 text-sm">{selectedOrder.customerName}</p>
                  <p className="text-white/60 text-sm">{selectedOrder.customerEmail}</p>
                  {selectedOrder.customerPhone && <p className="text-white/60 text-sm">{selectedOrder.customerPhone}</p>}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">معلومات الطلب</h3>
                  <p className="text-white/80 text-sm">الإجمالي: <span className="font-bold">{selectedOrder.total.toLocaleString()} MRU</span></p>
                  <p className="text-white/60 text-sm">الدفع: {selectedOrder.paymentStatus}</p>
                  <p className="text-white/60 text-sm">التاريخ: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">المنتجات</h3>
                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-2 text-left font-bold text-white/70">المنتج</th>
                        <th className="px-4 py-2 text-left font-bold text-white/70">SKU</th>
                        <th className="px-4 py-2 text-left font-bold text-white/70">الكمية</th>
                        <th className="px-4 py-2 text-left font-bold text-white/70">سعر الوحدة</th>
                        <th className="px-4 py-2 text-left font-bold text-white/70">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-white/5">
                          <td className="px-4 py-2 text-white/80">{item.productName}</td>
                          <td className="px-4 py-2 text-white/60">{item.productSku || "-"}</td>
                          <td className="px-4 py-2 text-white/80">{item.quantity}</td>
                          <td className="px-4 py-2 text-white/80">{item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 text-white/80">{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">الجدول الزمني للحالة</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FLOW.map((s) => (
                    <span key={s} className={`inline-flex px-3 py-1.5 rounded-lg border text-xs font-medium ${s === selectedOrder.status ? statusColor(s) : "border-white/10 text-white/30 bg-white/5"}`}>
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-white/60 mb-1">تحديث الحالة</label>
                  <select
                    className="input"
                    value={selectedOrder.status}
                    onChange={(e) => {
                      void updateStatus(selectedOrder.id, e.target.value);
                      setSelectedOrder({ ...selectedOrder, status: e.target.value });
                    }}
                  >
                    {STATUS_FLOW.filter((s) => s === selectedOrder.status || STATUS_FLOW.indexOf(s) >= STATUS_FLOW.indexOf(selectedOrder.status)).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
