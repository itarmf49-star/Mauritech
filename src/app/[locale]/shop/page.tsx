"use client";

import { useEffect, useState } from "react";
import ShopHero from "@/components/shop/ShopHero";
import ProductCard from "@/components/shop/ProductCard";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

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

type ShopPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default function ShopPage({
  params,
}: ShopPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (categoryFilter) qs.set("categoryId", categoryFilter);
        if (search) qs.set("search", search);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?${qs.toString()}`, { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products || []);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories || []);
        }
      } catch (e) {
        console.error("SHOP_ERROR:", e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [categoryFilter, search]);

  return (
    <main className="min-h-screen bg-[#0B1220] py-10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <ShopHero locale={locale} />

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setCategoryFilter("")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              categoryFilter === ""
                ? "bg-[#F5C542] text-black"
                : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                categoryFilter === cat.id
                  ? "bg-[#F5C542] text-black"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="البحث عن منتجات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#F5C542]/50"
          />
        </div>

        {/* Products Grid */}
        <section className="mt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">جميع المنتجات</h2>
            <p className="text-gray-300 mt-2">معدات الشبكات والاتصالات المتوفرة من مخزوننا</p>
          </div>

          {loading ? (
            <div className="text-white/60 text-center py-12">جارٍ تحميل المنتجات...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-white bg-black/30 rounded-2xl p-6 border border-white/10 text-center">
              لا توجد منتجات متاحة حالياً
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
