"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    product: { name: string; images: string[] };
  }[];
};

export default function OrdersPage() {
  const router = useRouter();
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B1220] py-10">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">{t(locale, "orderViewOrders")}</h1>

        {loading && <p className="text-white/60">{t(locale, "adminLoading")}</p>}

        {!loading && orders.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70 mb-4">{t(locale, "orderNoOrders")}</p>
            <button className="btn btn-primary" onClick={() => router.push(`/${locale}/shop`)}>
              {t(locale, "orderContinueShopping")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-bold">#{order.orderNumber}</p>
                    <p className="text-white/60 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold">{order.total.toLocaleString()} MRU</p>
                    <p className="text-xs text-white/60">{t(locale, "orderStatus")}: {order.status}</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-white/10 pt-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-white/70">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>{(item.unitPrice * item.quantity).toLocaleString()} MRU</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
