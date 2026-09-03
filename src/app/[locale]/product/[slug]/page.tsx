"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { defaultLocale, isLocale, localePath, t, type Locale } from "@/lib/i18n";
import BuyButton from "@/components/shop/BuyButton";
import ProductCard from "@/components/shop/ProductCard";
import { computeDiscountedPrice, type ProductOffer } from "@/lib/pricing";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  userName: string;
  createdAt: string;
};

type Product = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string;
  descriptionAr: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  category: { id: string; name: string } | null;
  inventory: { quantity: number } | null;
  store: { id: string; slug: string; nameFr: string; nameAr: string; logoUrl: string | null } | null;
  offerProducts: ProductOffer[];
  reviews: Review[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(t(locale, "productNotFound"));
        const data = await res.json();
        setProduct(data.product);

        if (data.product?.store?.id) {
          const relRes = await fetch(`/api/products?storeId=${data.product.store.id}`, { cache: "no-store" });
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelated((relData.products || []).filter((p: any) => p.id !== data.product.id).slice(0, 4));
          }
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) void load();
  }, [slug, locale]);

  const displayName = product ? (locale === "ar" && product.nameAr ? product.nameAr : product.name) : "";
  const displayDescription = product ? (locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description) : "";
  const { finalPrice, appliedOffer } = product ? computeDiscountedPrice(product.price, product.offerProducts) : { finalPrice: 0, appliedOffer: null };
  const hasDiscount = product ? finalPrice < product.price : false;

  return (
    <main className="min-h-screen bg-[#EAEDED] py-8">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href={localePath(locale, "/")} className="text-[#007185] hover:underline">
              {t(locale, "productBackToShop")}
            </Link>
          </div>
        )}

        {!loading && product && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="rounded-lg bg-gray-50 aspect-square flex items-center justify-center overflow-hidden relative">
                {hasDiscount && (
                  <span className="absolute top-4 start-4 z-10 bg-[#CC0C39] text-white text-sm font-bold px-3 py-1.5 rounded">
                    {appliedOffer?.discountType === "PERCENT" ? `-${appliedOffer.discountValue}%` : `-${(product.price - finalPrice).toLocaleString()} MRU`}
                  </span>
                )}
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={displayName} className="h-full w-full object-contain p-6" />
                ) : (
                  <span className="text-gray-400">{t(locale, "adminNoData")}</span>
                )}
              </div>
              <div className="flex flex-col">
                {product.store && (
                  <Link
                    href={localePath(locale, `/store/${product.store.slug}`)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#007185] mb-3 w-fit"
                  >
                    {product.store.logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.store.logoUrl} alt="" className="h-5 w-5 rounded object-contain" />
                    )}
                    {locale === "ar" ? product.store.nameAr : product.store.nameFr}
                  </Link>
                )}
                {product.category ? (
                  <span className="text-xs font-bold text-[#007185] uppercase tracking-wider mb-2">{product.category.name}</span>
                ) : null}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{displayName}</h1>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-[#B12704]">{finalPrice.toLocaleString()} MRU</span>
                  {hasDiscount ? (
                    <span className="text-gray-400 line-through">{product.price.toLocaleString()} MRU</span>
                  ) : product.comparePrice ? (
                    <span className="text-gray-400 line-through">{product.comparePrice.toLocaleString()} MRU</span>
                  ) : null}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{displayDescription}</p>
                <div className="text-sm text-gray-500 mb-6">
                  {t(locale, "adminInventoryQuantity")}: <span className="font-semibold text-gray-800">{product.inventory?.quantity ?? 0}</span>
                </div>
                <div className="mt-auto">
                  <BuyButton productId={product.id} locale={locale} />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t(locale, "productReviews")}</h2>
              {product.reviews.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.map((r) => (
                    <div key={r.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-900 font-semibold text-sm">{r.userName}</span>
                        <span className="text-[#FF9900] text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      </div>
                      {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">{t(locale, "productNoReviews")}</p>
              )}
            </section>

            {/* Related products */}
            {related.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 mb-5">{t(locale, "productSameStore")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {related.map((p) => (
                    <ProductCard key={p.id} locale={locale} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
