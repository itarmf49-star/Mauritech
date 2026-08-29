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
    slug: string;
    price: number;
    images: string[];
    inventory: { quantity: number } | null;
  };
};

export default function CartPage() {
  const router = useRouter();
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
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

  async function updateQuantity(productId: string, delta: number) {
    setUpdating(productId);
    try {
      const item = items.find((i) => i.productId === productId);
      if (!item) return;
      const newQty = Math.max(1, item.quantity + delta);
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(productId: string) {
    setUpdating(productId);
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdating(null);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;

  return (
    <main className="min-h-screen bg-[#0B1220] py-10">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">{t(locale, "cart")}</h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {loading && <p className="text-white/60">{t(locale, "adminLoading")}</p>}

        {!loading && items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70 text-lg mb-4">{t(locale, "cartEmpty")}</p>
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/${locale}/shop`)}
            >
              {t(locale, "cartContinueShopping")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-4">
                  <div className="h-24 w-24 rounded-xl bg-white/5 flex items-center justify-center text-white/40 text-xs overflow-hidden">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      "بدون صورة"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{item.product.name}</h3>
                    <p className="text-[#3b82f6] font-bold mt-1">{item.product.price.toLocaleString()} MRU</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center"
                        onClick={() => void updateQuantity(item.productId, -1)}
                        disabled={updating === item.productId || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center"
                        onClick={() => void updateQuantity(item.productId, 1)}
                        disabled={updating === item.productId}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      className="text-red-400 text-xs hover:text-red-300"
                      onClick={() => void removeItem(item.productId)}
                      disabled={updating === item.productId}
                    >
                      {t(locale, "adminDelete")}
                    </button>
                    <p className="text-white font-bold">{(item.product.price * item.quantity).toLocaleString()} MRU</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit">
              <h2 className="text-xl font-bold text-white mb-4">{t(locale, "orderSummary")}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>{t(locale, "orderSubtotal")}</span>
                  <span className="text-white">{subtotal.toLocaleString()} MRU</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>{t(locale, "orderShipping")}</span>
                  <span className="text-white">0 MRU</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>{t(locale, "orderGrandTotal")}</span>
                  <span>{total.toLocaleString()} MRU</span>
                </div>
              </div>
              <button
                className="btn btn-primary w-full mt-6"
                onClick={() => router.push(`/${locale}/checkout`)}
              >
                {t(locale, "cartProceedToCheckout")}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
