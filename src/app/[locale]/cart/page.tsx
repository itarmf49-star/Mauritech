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
    slug: string;
    price: number;
    images: string[];
    inventory: { quantity: number } | null;
    offerProducts?: ProductOffer[];
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update cart");
      }
      await load();
      window.dispatchEvent(new Event("cart:updated"));
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to remove item");
      }
      await load();
      window.dispatchEvent(new Event("cart:updated"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdating(null);
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const { finalPrice } = computeDiscountedPrice(item.product.price, item.product.offerProducts);
    return sum + finalPrice * item.quantity;
  }, 0);
  const total = subtotal;

  return (
    <main className="min-h-screen bg-[#EAEDED] py-8">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t(locale, "cart")}</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}

        {!loading && items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600 text-lg mb-4">{t(locale, "cartEmpty")}</p>
            <button
              className="bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] font-bold px-6 py-2 rounded-full"
              onClick={() => router.push(`/${locale}`)}
            >
              {t(locale, "cartContinueShopping")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const { finalPrice, appliedOffer } = computeDiscountedPrice(item.product.price, item.product.offerProducts);
                const hasDiscount = finalPrice < item.product.price;
                const displayName = locale === "ar" && item.product.nameAr ? item.product.nameAr : item.product.name;
                return (
                <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 flex gap-4 shadow-sm">
                  <div className="h-24 w-24 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden shrink-0">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={displayName} className="h-full w-full object-contain p-1" />
                    ) : (
                      t(locale, "adminNoData")
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-medium truncate">{displayName}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-[#B12704] font-bold">{finalPrice.toLocaleString()} MRU</p>
                      {hasDiscount && <p className="text-gray-400 text-sm line-through">{item.product.price.toLocaleString()} MRU</p>}
                      {appliedOffer && <span className="text-[10px] text-[#CC0C39] font-bold">{locale === "ar" ? appliedOffer.titleAr : appliedOffer.titleFr}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                        onClick={() => void updateQuantity(item.productId, -1)}
                        disabled={updating === item.productId || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-gray-900 font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                        onClick={() => void updateQuantity(item.productId, 1)}
                        disabled={updating === item.productId}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      className="text-[#007185] text-xs hover:underline"
                      onClick={() => void removeItem(item.productId)}
                      disabled={updating === item.productId}
                    >
                      {t(locale, "adminDelete")}
                    </button>
                    <p className="text-gray-900 font-bold">{(finalPrice * item.quantity).toLocaleString()} MRU</p>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 h-fit shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t(locale, "orderSummary")}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{t(locale, "orderSubtotal")}</span>
                  <span className="text-gray-900">{subtotal.toLocaleString()} MRU</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t(locale, "orderShipping")}</span>
                  <span className="text-gray-900">0 MRU</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-900 font-bold text-lg">
                  <span>{t(locale, "orderGrandTotal")}</span>
                  <span>{total.toLocaleString()} MRU</span>
                </div>
              </div>
              <button
                className="w-full mt-6 bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold py-2.5 rounded-full"
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
