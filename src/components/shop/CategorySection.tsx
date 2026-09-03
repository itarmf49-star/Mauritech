import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { localePath, type Locale } from "@/lib/i18n";
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
  rating?: number;
  reviewCount?: number;
};

/** لوحة ألوان الأقسام — تُستخدم بالتدوير حسب ترتيب القسم، فقاعة زجاجية متحركة بلونين متدرجين لكل قسم. */
const PALETTE = [
  { a: "rgba(59,130,246,0.35)", b: "rgba(45,212,191,0.28)", ring: "border-blue-100" },
  { a: "rgba(168,85,247,0.32)", b: "rgba(236,72,153,0.24)", ring: "border-purple-100" },
  { a: "rgba(251,146,60,0.35)", b: "rgba(250,204,21,0.24)", ring: "border-orange-100" },
  { a: "rgba(16,185,129,0.32)", b: "rgba(45,212,191,0.24)", ring: "border-emerald-100" },
  { a: "rgba(244,63,94,0.3)", b: "rgba(217,70,239,0.22)", ring: "border-rose-100" },
  { a: "rgba(99,102,241,0.32)", b: "rgba(56,189,248,0.24)", ring: "border-indigo-100" },
];

type CategorySectionProps = {
  locale: Locale;
  categoryId: string;
  categoryName: string;
  colorIndex: number;
  products: Product[];
};

export function CategorySection({ locale, categoryId, categoryName, colorIndex, products }: CategorySectionProps) {
  if (products.length === 0) return null;
  const theme = PALETTE[colorIndex % PALETTE.length];

  return (
    <section className="relative overflow-hidden rounded-3xl mb-8">
      {/* الخلفية الزجاجية المتحركة الخاصة بهذا القسم */}
      <div className="absolute inset-0 bg-white">
        <div
          className="category-blob h-64 w-64 -top-10 -start-10"
          style={{ background: theme.a, ["--blob-x" as string]: "40px", ["--blob-y" as string]: "20px" }}
        />
        <div
          className="category-blob category-blob-delay-1 h-72 w-72 -bottom-16 -end-10"
          style={{ background: theme.b, ["--blob-x" as string]: "-30px", ["--blob-y" as string]: "-25px" }}
        />
        <div
          className="category-blob category-blob-delay-2 h-40 w-40 top-1/3 start-1/3"
          style={{ background: theme.a, ["--blob-x" as string]: "20px", ["--blob-y" as string]: "-15px" }}
        />
      </div>

      {/* اللوحة الزجاجية الشفافة الحاملة للبطاقات */}
      <div className={`relative backdrop-blur-xl bg-white/55 border ${theme.ring} p-5 sm:p-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{categoryName}</h2>
          {!categoryId.startsWith("__") && (
            <Link
              href={localePath(locale, `/?categoryId=${categoryId}`)}
              className="text-sm font-semibold text-[#007185] hover:underline shrink-0"
            >
              عرض الكل ›
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} locale={locale} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
