"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { computeDiscountedPrice, type ProductOffer } from "@/lib/pricing";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    nameAr?: string | null;
    price: number;
    inventory: { quantity: number } | null;
    offerProducts?: ProductOffer[];
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "", paymentMethod: "COD" });

  const paymentMethods = [
    { value: "COD", labelKey: "paymentCOD" as const, icon: "💵" },
    { value: "BANKILY", labelKey: "paymentBankily" as const, icon: "📱" },
    { value: "MASRVI", labelKey: "paymentMasrvi" as const, icon: "📱" },
    { value: "SEDAD", labelKey: "paymentSedad" as const, icon: "📱" },
  ];

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

  const subtotal = items.reduce((sum, item) => {
    const { finalPrice } = computeDiscountedPrice(item.product.price, item.product.offerProducts);
    return sum + finalPrice * item.quantity;
  }, 0);
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

  const fieldCls = "w-full h-11 rounded-lg px-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]";
  const areaCls = "w-full rounded-lg px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] h-20";

  return (
    <main className="min-h-screen bg-[#EAEDED] py-8">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t(locale, "checkout")}</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}

        {!loading && items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600 mb-4">{t(locale, "cartEmpty")}</p>
            <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] font-bold px-6 py-2 rounded-full" onClick={() => router.push(`/${locale}`)}>
              {t(locale, "cartContinueShopping")}
            </button>
          </div>
        ) : (
          <form onSubmit={submitOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900">{t(locale, "orderCustomerInfo")}</h2>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "orderCustomerName")}</label>
                    <input className={fieldCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "orderCustomerEmail")}</label>
                    <input className={fieldCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "orderCustomerPhone")}</label>
                    <input className={fieldCls} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "orderShippingAddress")}</label>
                    <textarea className={areaCls} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "orderNotes")}</label>
                    <textarea className={areaCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900">{t(locale, "orderPaymentMethod")}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map((m) => (
                      <label
                        key={m.value}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                          form.paymentMethod === m.value ? "border-[#FF9900] ring-1 ring-[#FF9900] bg-[#FFF8EE]" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="accent-[#FF9900]"
                          checked={form.paymentMethod === m.value}
                          onChange={() => setForm({ ...form, paymentMethod: m.value })}
                        />
                        <span className="text-lg">{m.icon}</span>
                        <span className="text-sm font-semibold text-gray-800">{t(locale, m.labelKey)}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs">{t(locale, "orderPaymentHint")}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 h-fit shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t(locale, "orderSummary")}</h2>
                <div className="space-y-3 text-sm mb-6">
                  {items.map((item) => {
                    const { finalPrice } = computeDiscountedPrice(item.product.price, item.product.offerProducts);
                    const displayName = locale === "ar" && item.product.nameAr ? item.product.nameAr : item.product.name;
                    return (
                      <div key={item.id} className="flex justify-between text-gray-600">
                        <span className="truncate">{displayName} x {item.quantity}</span>
                        <span className="text-gray-900">{(finalPrice * item.quantity).toLocaleString()} MRU</span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-3 text-sm border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>{t(locale, "orderSubtotal")}</span>
                    <span className="text-gray-900">{subtotal.toLocaleString()} MRU</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t(locale, "orderShipping")}</span>
                    <span className="text-gray-900">0 MRU</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-lg">
                    <span>{t(locale, "orderGrandTotal")}</span>
                    <span>{total.toLocaleString()} MRU</span>
                  </div>
                </div>
                <button type="submit" className="w-full mt-6 bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold py-2.5 rounded-full disabled:opacity-60" disabled={submitting}>
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
