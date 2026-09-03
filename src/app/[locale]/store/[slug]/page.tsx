"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { StoreRail } from "@/components/shop/StoreRail";
import { OffersBanner } from "@/components/shop/OffersBanner";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import type { ProductOffer } from "@/lib/pricing";

type Store = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  currency: string;
};

type Product = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  inventory: { quantity: number } | null;
  offerProducts?: ProductOffer[];
};

type StoreListing = { id: string; slug: string; nameFr: string; nameAr: string; logoUrl: string | null; _count: { products: number } };

export default function StorefrontPage() {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allStores, setAllStores] = useState<StoreListing[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/stores/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(t(locale, "shopStoreNotFound"));
        const data = await res.json();
        setStore(data.store);
        setProducts(data.products || []);

        const [storesRes, offersRes] = await Promise.all([
          fetch("/api/stores"),
          fetch(`/api/offers?storeId=${data.store.id}`, { cache: "no-store" }),
        ]);
        if (storesRes.ok) setAllStores((await storesRes.json()).stores || []);
        if (offersRes.ok) setOffers((await offersRes.json()).offers || []);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) void load();
  }, [slug, locale]);

  return (
    <main className="min-h-screen bg-[#EAEDED] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && store && (
          <>
            <section className="relative overflow-hidden rounded-lg mb-8 border border-gray-200 bg-white shadow-sm">
              {store.bannerUrl && (
                <div className="h-40 w-full bg-gray-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={store.bannerUrl} alt="" className="h-full w-full object-contain" />
                </div>
              )}
              <div className="relative p-6 md:p-8 flex items-center gap-5">
                <div className="h-20 w-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  {store.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={store.logoUrl} alt="" className="h-full w-full object-contain p-2" />
                  ) : (
                    <span className="text-gray-400 text-2xl font-black">{(locale === "ar" ? store.nameAr : store.nameFr).slice(0, 2)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{locale === "ar" ? store.nameAr : store.nameFr}</h1>
                  {(locale === "ar" ? store.descriptionAr : store.descriptionFr) && (
                    <p className="text-gray-500 mt-1 max-w-2xl">{locale === "ar" ? store.descriptionAr : store.descriptionFr}</p>
                  )}
                </div>
              </div>
            </section>

            <StoreRail locale={locale} stores={allStores} activeSlug={store.slug} />
            <OffersBanner locale={locale} offers={offers} />

            <section className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t(locale, "adminProducts")}</h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.id} locale={locale} product={{ ...p, store: { slug: store.slug, nameFr: store.nameFr, nameAr: store.nameAr, logoUrl: store.logoUrl } }} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-10 border border-gray-200 text-center">
                  <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-bold">{t(locale, "shopNoProductsTitle")}</p>
                  <p className="text-gray-500 text-sm max-w-sm">{t(locale, "shopNoProductsHint")}</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
