"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    inventory: { quantity: number } | null;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }

      const data = await res.json();
      router.push(`/${locale}/checkout/success?orderId=${data.order?.id || ""}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1220] py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">{t(locale, "checkout")}</h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {loading && <p className="text-white/60">{t(locale, "adminLoading")}</p>}

        {!loading && items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70 mb-4">{t(locale, "cartEmpty")}</p>
            <button className="btn btn-primary" onClick={() => router.push(`/${locale}/shop`)}>
              {t(locale, "cartContinueShopping")}
            </button>
          </div>
        ) : (
          <form onSubmit={submitOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                  <h2 className="text-xl font-bold text-white">{t(locale, "orderCustomerInfo")}</h2>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "orderCustomerName")}</label>
                    <input className="input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "orderCustomerEmail")}</label>
                    <input className="input w-full" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "orderCustomerPhone")}</label>
                    <input className="input w-full" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "orderShippingAddress")}</label>
                    <textarea className="input w-full h-20" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">{t(locale, "orderNotes")}</label>
                    <textarea className="input w-full h-20" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit">
                <h2 className="text-xl font-bold text-white mb-4">{t(locale, "orderSummary")}</h2>
                <div className="space-y-3 text-sm mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-white/70">
                      <span className="truncate">{item.product.name} x {item.quantity}</span>
                      <span className="text-white">{(item.product.price * item.quantity).toLocaleString()} MRU</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 text-sm border-t border-white/10 pt-3">
                  <div className="flex justify-between text-white/70">
                    <span>{t(locale, "orderSubtotal")}</span>
                    <span className="text-white">{subtotal.toLocaleString()} MRU</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>{t(locale, "orderShipping")}</span>
                    <span className="text-white">0 MRU</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>{t(locale, "orderGrandTotal")}</span>
                    <span>{total.toLocaleString()} MRU</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-6" disabled={submitting}>
                  {submitting ? t(locale, "adminLoading") : t(locale, "orderPlaceOrder")}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
