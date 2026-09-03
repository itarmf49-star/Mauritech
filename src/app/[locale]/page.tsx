"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { CategorySection } from "@/components/shop/CategorySection";
import { StoreRail } from "@/components/shop/StoreRail";
import { OffersBanner } from "@/components/shop/OffersBanner";
import { CategoryTiles } from "@/components/shop/CategoryTiles";
import { defaultLocale, isLocale, localePath, t, type Locale } from "@/lib/i18n";
import type { ProductOffer } from "@/lib/pricing";

type Product = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  inventory: { quantity: number } | null;
  store: { slug: string; nameFr: string; nameAr: string; logoUrl: string | null } | null;
  offerProducts: ProductOffer[];
  category: { id: string; name: string; slug: string } | null;
  rating?: number;
  reviewCount?: number;
};

type Store = { id: string; slug: string; nameFr: string; nameAr: string; logoUrl: string | null; _count: { products: number } };
type Category = { id: string; name: string; slug: string; image: string | null; _count: { products: number } };
type Offer = {
  id: string; titleFr: string; titleAr: string; bodyFr: string | null; bodyAr: string | null;
  bannerImage: string | null; discountType: "PERCENT" | "FIXED" | "NONE"; discountValue: number | null; code: string | null;
};

type HomePageProps = { params: Promise<{ locale: string }> };

export default function HomePage({ params }: HomePageProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    void params.then(({ locale: raw }) => setLocale(isLocale(raw) ? raw : defaultLocale));
  }, [params]);

  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(searchParams?.get("q") || "");
    setCategoryFilter(searchParams?.get("categoryId") || "");
  }, [searchParams]);

  useEffect(() => {
    async function loadStatic() {
      try {
        const [storesRes, offersRes, categoriesRes] = await Promise.all([
          fetch("/api/stores"),
          fetch("/api/offers"),
          fetch("/api/categories"),
        ]);
        if (storesRes.ok) setStores((await storesRes.json()).stores || []);
        if (offersRes.ok) setOffers((await offersRes.json()).offers || []);
        if (categoriesRes.ok) setCategories((await categoriesRes.json()).categories || []);
      } catch (e) {
        console.error("HOME_STATIC_ERROR:", e);
      }
    }
    void loadStatic();
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (categoryFilter) qs.set("categoryId", categoryFilter);
        if (search) qs.set("search", search);
        const res = await fetch(`/api/products?${qs.toString()}`, { cache: "no-store" });
        if (res.ok) setProducts((await res.json()).products || []);
      } catch (e) {
        console.error("HOME_PRODUCTS_ERROR:", e);
      } finally {
        setLoading(false);
      }
    }
    const debounce = setTimeout(() => void load(), search ? 350 : 0);
    return () => clearTimeout(debounce);
  }, [categoryFilter, search]);

  const isSectioned = !search && !categoryFilter;

  // في العرض الافتراضي (بلا بحث ولا فلترة) نجمّع المنتجات حسب القسم — كل قسم بشريط
  // خلفية زجاجي متحرك بلون مختلف، بدل شبكة واحدة مسطحة لكل المنتجات معاً.
  const groupedByCategory = useMemo(() => {
    if (!isSectioned) return [];
    const map = new Map<string, { id: string; name: string; products: Product[] }>();
    const uncategorized: Product[] = [];
    for (const p of products) {
      if (!p.category) {
        uncategorized.push(p);
        continue;
      }
      const entry = map.get(p.category.id) ?? { id: p.category.id, name: p.category.name, products: [] };
      entry.products.push(p);
      map.set(p.category.id, entry);
    }
    const groups = Array.from(map.values());
    if (uncategorized.length > 0) {
      groups.push({ id: "__uncategorized", name: t(locale, "adminNoCategory"), products: uncategorized });
    }
    return groups;
  }, [products, isSectioned, locale]);

  return (
    <main className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
        {search && (
          <p className="text-gray-600 text-sm mb-4">
            {t(locale, "adminSearchProducts")}: <span className="font-bold text-gray-900">{search}</span>
          </p>
        )}

        <CategoryTiles locale={locale} categories={categories} onSelect={(id) => setCategoryFilter((cur) => (cur === id ? "" : id))} />
        <StoreRail locale={locale} stores={stores} />
        <OffersBanner locale={locale} offers={offers} />

        {categoryFilter && (
          <div className="mb-4">
            <button
              onClick={() => setCategoryFilter("")}
              className="text-sm font-semibold text-[#007185] hover:underline"
            >
              × {t(locale, "adminAllCategoriesFilter")}
            </button>
          </div>
        )}

        <section id="products" className="mt-4">
          {(!isSectioned || loading || products.length === 0) && (
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">{t(locale, "adminProducts")}</h2>
              {!loading && products.length > 0 && (
                <span className="text-sm text-gray-500">{products.length} {t(locale, "shopProductsSuffix")}</span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-5 bg-gray-100 rounded w-1/3" />
                    <div className="h-9 bg-gray-100 rounded-full w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 && isSectioned ? (
            <div>
              {groupedByCategory.map((group, idx) => (
                <CategorySection
                  key={group.id}
                  locale={locale}
                  categoryId={group.id}
                  categoryName={group.name}
                  colorIndex={idx}
                  products={group.products.slice(0, 8)}
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} locale={locale} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h6" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-bold">{t(locale, "shopNoProductsTitle")}</p>
                <p className="text-gray-500 text-sm mt-1 max-w-sm">{t(locale, "shopNoProductsHint")}</p>
              </div>
              {(search || categoryFilter) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("");
                    router.push(localePath(locale, "/"));
                  }}
                  className="mt-1 px-5 py-2 rounded-full bg-[#FF9900] hover:bg-[#F3A847] text-[#131921] text-sm font-bold transition"
                >
                  {t(locale, "shopClearFilters")}
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
