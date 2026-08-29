"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import BuyButton from "@/components/shop/BuyButton";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  category: { id: string; name: string } | null;
  inventory: { quantity: number } | null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        const p = data.products?.[0];
        if (!p) throw new Error("Product not found");
        setProduct(p);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) void load();
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#0B1220] py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {loading && <p className="text-white/60">{t(locale, "adminLoading")}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 aspect-square flex items-center justify-center overflow-hidden">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-white/40">بدون صورة</span>
              )}
            </div>
            <div className="flex flex-col">
              {product.category ? (
                <span className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider mb-2">{product.category.name}</span>
              ) : null}
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-black text-[#3b82f6]">{product.price.toLocaleString()} MRU</span>
                {product.comparePrice ? (
                  <span className="text-white/50 line-through">{product.comparePrice.toLocaleString()} MRU</span>
                ) : null}
              </div>
              <p className="text-white/80 leading-relaxed mb-6">{product.description}</p>
              <div className="mt-auto">
                <BuyButton productId={product.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
