"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { defaultLocale, isLocale, localePath, t, type Locale } from "@/lib/i18n";

type OrderItem = {
  id: string;
  productName: string;
  productSku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: any;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
  items: OrderItem[];
};

const PAYMENT_LABEL_KEYS: Record<string, string> = {
  COD: "paymentCOD",
  BANKILY: "paymentBankily",
  MASRVI: "paymentMasrvi",
  SEDAD: "paymentSedad",
  CARD: "paymentCARD",
};

function formatAddress(addr: any): string {
  if (!addr) return "—";
  if (typeof addr === "string") return addr;
  return addr.street || "—";
}

export default function CheckoutSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const orderId = searchParams?.get("orderId") || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  return (
    <main className="min-h-screen bg-[#EAEDED] py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm print:shadow-none print:border-0 text-center mb-6 print:hidden">
          <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900">{t(locale, "orderSuccess")}</h1>
          <p className="text-gray-500 mt-1">{t(locale, "orderConfirmation")}</p>
        </div>

        {loading && <p className="text-gray-500 text-center">{t(locale, "adminLoading")}</p>}
        {!loading && !order && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">{error || t(locale, "orderNoOrders")}</p>
          </div>
        )}

        {order && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm print:shadow-none print:border-0 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t(locale, "orderNumber")}</p>
                <p className="text-2xl font-black text-gray-900 font-mono">{order.orderNumber}</p>
                <p className="text-gray-400 text-sm mt-1">{new Date(order.createdAt).toLocaleString(locale === "ar" ? "ar" : "fr")}</p>
              </div>
              <div className="text-end">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">MauriTech</p>
                <p className="text-gray-500 text-sm">mauritech.tech</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t(locale, "orderCustomerInfo")}</p>
                <p className="text-gray-900 font-semibold">{order.customerName}</p>
                <p className="text-gray-500 text-sm">{order.customerEmail}</p>
                {order.customerPhone && <p className="text-gray-500 text-sm" dir="ltr">{order.customerPhone}</p>}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t(locale, "orderShippingAddress")}</p>
                <p className="text-gray-700 text-sm">{formatAddress(order.shippingAddress)}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {t(locale, "orderPaymentMethod")}: <span className="text-gray-700 font-medium">{t(locale, (PAYMENT_LABEL_KEYS[order.paymentMethod || ""] as any) || "paymentCOD")}</span>
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-start font-bold text-gray-500">المنتج</th>
                      <th className="py-2 text-center font-bold text-gray-500">الكمية</th>
                      <th className="py-2 text-end font-bold text-gray-500">السعر</th>
                      <th className="py-2 text-end font-bold text-gray-500">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50">
                        <td className="py-2.5 text-gray-800">{item.productName}</td>
                        <td className="py-2.5 text-center text-gray-600">{item.quantity}</td>
                        <td className="py-2.5 text-end text-gray-600">{item.unitPrice.toLocaleString()} MRU</td>
                        <td className="py-2.5 text-end text-gray-900 font-semibold">{item.total.toLocaleString()} MRU</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="max-w-xs ms-auto space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{t(locale, "orderSubtotal")}</span>
                  <span>{order.subtotal.toLocaleString()} MRU</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>{t(locale, "orderDiscount")}</span>
                    <span>-{order.discount.toLocaleString()} MRU</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>{t(locale, "orderShipping")}</span>
                  <span>{order.shipping.toLocaleString()} MRU</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-lg border-t border-gray-200 pt-2">
                  <span>{t(locale, "orderGrandTotal")}</span>
                  <span>{order.total.toLocaleString()} MRU</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8 justify-center print:hidden">
          {order && (
            <button onClick={() => window.print()} className="btn-light-secondary">
              🖨️ طباعة / حفظ الفاتورة
            </button>
          )}
          <Link href={localePath(locale, "/")} className="btn-light-primary">
            {t(locale, "orderContinueShopping")}
          </Link>
          <Link href={localePath(locale, "/orders")} className="btn-light-secondary">
            {t(locale, "orderViewOrders")}
          </Link>
        </div>
      </div>
    </main>
  );
}
