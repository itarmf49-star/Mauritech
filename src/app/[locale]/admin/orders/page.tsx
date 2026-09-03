"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
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
  paymentMethod: string | null;
  paymentIntentId: string | null;
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

const STATUS_LABEL_KEYS: Record<string, any> = {
  PENDING: "adminPending",
  CONFIRMED: "adminConfirmed",
  PROCESSING: "adminProcessed",
  SHIPPED: "adminShipped",
  DELIVERED: "adminDelivered",
  CANCELLED: "adminCancelled",
  REFUNDED: "adminRefunded",
};

const PAYMENT_STATUS_LABEL_KEYS: Record<string, any> = {
  PENDING: "paymentStatusPending",
  PAID: "paymentStatusPaid",
  FAILED: "paymentStatusFailed",
  REFUNDED: "paymentStatusRefunded",
  PARTIALLY_REFUNDED: "paymentStatusPartiallyRefunded",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "border-yellow-500/25 text-yellow-600 bg-yellow-50",
  PAID: "border-emerald-500/25 text-emerald-600 bg-emerald-50",
  FAILED: "border-red-500/25 text-red-600 bg-red-50",
  REFUNDED: "border-gray-200 text-gray-500 bg-gray-50",
  PARTIALLY_REFUNDED: "border-orange-500/25 text-orange-600 bg-orange-50",
};

const PAYMENT_METHOD_LABEL_KEYS: Record<string, any> = {
  COD: "paymentCOD",
  BANKILY: "paymentBankily",
  MASRVI: "paymentMasrvi",
  SEDAD: "paymentSedad",
  CARD: "paymentCARD",
};

export default function AdminOrdersPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState("");
  const [paymentRefDraft, setPaymentRefDraft] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!res.ok) throw new Error(t(locale, "adminLoadingOrders"));
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
    const paymentsPending = orders.filter((o) => o.paymentStatus === "PENDING").length;
    const paymentsPaid = orders.filter((o) => o.paymentStatus === "PAID").length;
    return { total, pending, processing, delivered, revenue, paymentsPending, paymentsPaid };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!paymentFilter) return orders;
    return orders.filter((o) => o.paymentStatus === paymentFilter);
  }, [orders, paymentFilter]);

  async function updateOrder(orderId: string, patch: Record<string, string>) {
    setUpdatingStatus(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t(locale, "adminSettingsError"));
      }
      const data = await res.json();
      await load();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...data.order });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdatingStatus(null);
    }
  }

  function confirmPayment(order: Order) {
    void updateOrder(order.id, { paymentStatus: "PAID", paymentReference: paymentRefDraft });
    setPaymentRefDraft("");
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "border-yellow-500/25 text-yellow-600 bg-yellow-50";
      case "CONFIRMED": return "border-[#3b82f6]/25 text-[#3b82f6] bg-[#3b82f6]/5";
      case "PROCESSING": return "border-indigo-500/25 text-indigo-600 bg-indigo-50";
      case "SHIPPED": return "border-purple-500/25 text-purple-600 bg-purple-50";
      case "DELIVERED": return "border-green-500/25 text-emerald-600 bg-emerald-50";
      case "CANCELLED": return "border-red-500/25 text-red-600 bg-red-50";
      default: return "border-gray-200 text-gray-500 bg-white";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminOrdersManagement")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(locale, "adminOrdersHint")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalOrders")}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminDelivered")}</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{stats.delivered}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminConfirmedRevenue")}</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.revenue.toLocaleString()} MRU</p>
          </div>
          <button
            onClick={() => setPaymentFilter(paymentFilter === "PENDING" ? "" : "PENDING")}
            className={`text-start rounded-2xl border p-4 transition ${paymentFilter === "PENDING" ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
          >
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminPaymentsPendingConfirm")}</p>
            <p className="text-3xl font-black text-yellow-600 mt-2">{stats.paymentsPending}</p>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t(locale, "adminPaymentStatusLabel")}</span>
          {[["", t(locale, "portalFilterAll")], ...Object.entries(PAYMENT_STATUS_LABEL_KEYS).map(([k, key]) => [k, t(locale, key)])].map(([key, label]) => (
            <button
              key={"pay-" + (key || "all")}
              onClick={() => setPaymentFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                paymentFilter === key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
        )}
        {loading && <p className="text-gray-500">{t(locale, "adminLoadingOrders")}</p>}

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-start font-bold text-gray-600">{t(locale, "adminOrderNumber")}</th>
                  <th className="px-4 py-3 text-start font-bold text-gray-600">{t(locale, "adminCustomerCol")}</th>
                  <th className="px-4 py-3 text-start font-bold text-gray-600">{t(locale, "adminTotalCol")}</th>
                  <th className="px-4 py-3 text-start font-bold text-gray-600">{t(locale, "adminPaymentCol")}</th>
                  <th className="px-4 py-3 text-start font-bold text-gray-600">{t(locale, "adminOrderStatusCol")}</th>
                  <th className="px-4 py-3 text-start font-bold text-gray-600">{t(locale, "adminDate")}</th>
                  <th className="px-4 py-3 text-start font-bold text-gray-600">{t(locale, "adminActionsCol")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900 font-mono">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{o.customerName}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{o.total.toLocaleString()} MRU</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${PAYMENT_STATUS_COLORS[o.paymentStatus] || ""}`}>
                        {PAYMENT_STATUS_LABEL_KEYS[o.paymentStatus] ? t(locale, PAYMENT_STATUS_LABEL_KEYS[o.paymentStatus]) : o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${statusColor(o.status)}`}>
                        {STATUS_LABEL_KEYS[o.status] ? t(locale, STATUS_LABEL_KEYS[o.status]) : o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <button className="text-[#3b82f6] hover:underline text-xs font-bold" onClick={() => setSelectedOrder(o)}>{t(locale, "adminView")}</button>
                        {o.paymentStatus === "PENDING" && (
                          <button
                            className="text-emerald-600 hover:underline text-xs font-bold"
                            disabled={updatingStatus === o.id}
                            onClick={() => void updateOrder(o.id, { paymentStatus: "PAID" })}
                          >
                            {t(locale, "adminConfirmPayment")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && !loading && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">{t(locale, "adminNoMatchingOrders")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 font-mono">{t(locale, "adminOrderModalPrefix")} {selectedOrder.orderNumber}</h2>
                <button className="text-gray-500 hover:text-gray-900" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t(locale, "adminCustomerCol")}</h3>
                  <p className="text-gray-700 text-sm">{selectedOrder.customerName}</p>
                  <p className="text-gray-500 text-sm">{selectedOrder.customerEmail}</p>
                  {selectedOrder.customerPhone && <p className="text-gray-500 text-sm" dir="ltr">{selectedOrder.customerPhone}</p>}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t(locale, "adminOrderInfo")}</h3>
                  <p className="text-gray-700 text-sm">{t(locale, "adminTotalCol")}: <span className="font-bold">{selectedOrder.total.toLocaleString()} MRU</span></p>
                  <p className="text-gray-500 text-sm">{t(locale, "orderPaymentMethod")}: {selectedOrder.paymentMethod && PAYMENT_METHOD_LABEL_KEYS[selectedOrder.paymentMethod] ? t(locale, PAYMENT_METHOD_LABEL_KEYS[selectedOrder.paymentMethod]) : "—"}</p>
                  <p className="text-gray-500 text-sm">{t(locale, "adminDate")}: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t(locale, "adminPaymentVerification")}</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex px-3 py-1.5 rounded-lg border text-xs font-bold ${PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus] || ""}`}>
                    {PAYMENT_STATUS_LABEL_KEYS[selectedOrder.paymentStatus] ? t(locale, PAYMENT_STATUS_LABEL_KEYS[selectedOrder.paymentStatus]) : selectedOrder.paymentStatus}
                  </span>
                  <select
                    className="input-light text-xs py-1.5"
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => void updateOrder(selectedOrder.id, { paymentStatus: e.target.value })}
                    disabled={updatingStatus === selectedOrder.id}
                  >
                    {Object.entries(PAYMENT_STATUS_LABEL_KEYS).map(([s, key]) => (
                      <option key={s} value={s}>{t(locale, key)}</option>
                    ))}
                  </select>
                  <input
                    className="input-light text-xs py-1.5 flex-1 min-w-[160px]"
                    placeholder={t(locale, "adminPaymentReferencePlaceholder")}
                    defaultValue={selectedOrder.paymentIntentId || ""}
                    onChange={(e) => setPaymentRefDraft(e.target.value)}
                  />
                  {selectedOrder.paymentStatus !== "PAID" && (
                    <button
                      className="btn-light-primary text-xs py-1.5"
                      disabled={updatingStatus === selectedOrder.id}
                      onClick={() => confirmPayment(selectedOrder)}
                    >
                      {t(locale, "adminConfirmPaymentReceived")}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t(locale, "adminProducts")}</h3>
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-start font-bold text-gray-600">{t(locale, "adminProductName")}</th>
                        <th className="px-4 py-2 text-start font-bold text-gray-600">SKU</th>
                        <th className="px-4 py-2 text-start font-bold text-gray-600">{t(locale, "adminQty")}</th>
                        <th className="px-4 py-2 text-start font-bold text-gray-600">{t(locale, "adminUnitPrice")}</th>
                        <th className="px-4 py-2 text-start font-bold text-gray-600">{t(locale, "adminTotalCol")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="px-4 py-2 text-gray-700">{item.productName}</td>
                          <td className="px-4 py-2 text-gray-500">{item.productSku || "-"}</td>
                          <td className="px-4 py-2 text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-2 text-gray-700">{item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 text-gray-700">{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t(locale, "adminOrderStatusCol")}</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FLOW.map((s) => (
                    <span key={s} className={`inline-flex px-3 py-1.5 rounded-lg border text-xs font-medium ${s === selectedOrder.status ? statusColor(s) : "border-gray-200 text-gray-400 bg-white"}`}>
                      {t(locale, STATUS_LABEL_KEYS[s])}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminUpdateStatus")}</label>
                  <select
                    className="input-light"
                    value={selectedOrder.status}
                    onChange={(e) => void updateOrder(selectedOrder.id, { status: e.target.value })}
                    disabled={updatingStatus === selectedOrder.id}
                  >
                    {STATUS_FLOW.filter((s) => s === selectedOrder.status || STATUS_FLOW.indexOf(s) >= STATUS_FLOW.indexOf(selectedOrder.status)).map((s) => (
                      <option key={s} value={s}>{t(locale, STATUS_LABEL_KEYS[s])}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
