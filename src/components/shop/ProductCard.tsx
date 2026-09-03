"use client";

import Link from "next/link";
import BuyButton from "@/components/shop/BuyButton";
import { StarRating } from "@/components/shop/StarRating";
import { computeDiscountedPrice, type ProductOffer } from "@/lib/pricing";
import { localePath, t, type Locale } from "@/lib/i18n";

type ProductCardProps = {
  locale: Locale;
  product: {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    inventory: { quantity: number } | null;
    store?: { slug: string; nameFr: string; nameAr: string; logoUrl: string | null } | null;
    offerProducts?: ProductOffer[];
    rating?: number;
    reviewCount?: number;
  };
};

export default function ProductCard({ locale, product }: ProductCardProps) {
  const imageSrc = product.images?.[0] || null;
  const displayName = locale === "ar" && product.nameAr ? product.nameAr : product.name;
  const { finalPrice, appliedOffer } = computeDiscountedPrice(product.price, product.offerProducts);
  const hasDiscount = finalPrice < product.price;
  const inStock = (product.inventory?.quantity ?? 0) > 0;

  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-gray-200
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1
        hover:border-gray-300
        transition-all
        duration-300
        flex flex-col
        h-full
      "
    >
      {/* Product Image */}
      <Link href={localePath(locale, `/product/${product.slug}`)} className="block">
        <div className="h-56 bg-gray-50 flex items-center justify-center overflow-hidden relative">
          {hasDiscount && (
            <span className="absolute top-3 start-3 z-10 bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              {appliedOffer?.discountType === "PERCENT"
                ? `-${appliedOffer.discountValue}%`
                : `-${(product.price - finalPrice).toLocaleString()} MRU`}
            </span>
          )}
          {!inStock && (
            <span className="absolute top-3 end-3 z-10 bg-gray-900/80 text-white text-[11px] font-bold px-2 py-1 rounded-md">
              {t(locale, "shopOutOfStock")}
            </span>
          )}
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={displayName}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 4.5h18M3.75 4.5v15a2.25 2.25 0 0 0 2.25 2.25h12a2.25 2.25 0 0 0 2.25-2.25v-15M8.25 8.25h.008v.008H8.25V8.25Z" />
              </svg>
              <span className="text-xs">{t(locale, "adminNoData")}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 bg-white flex flex-col flex-1">
        {product.store && (
          <Link
            href={localePath(locale, `/store/${product.store.slug}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#007185] mb-2 w-fit"
          >
            {product.store.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.store.logoUrl} alt="" className="h-4 w-4 rounded object-contain" />
            )}
            {locale === "ar" ? product.store.nameAr : product.store.nameFr}
          </Link>
        )}

        <Link href={localePath(locale, `/product/${product.slug}`)}>
          <h2 className="text-base font-medium text-gray-900 line-clamp-2 min-h-[48px] hover:text-[#007185] transition-colors">
            {displayName}
          </h2>
        </Link>

        {typeof product.rating === "number" && product.rating > 0 && (
          <div className="mt-1.5">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xl font-bold text-[#B12704]">
            {finalPrice.toLocaleString()} MRU
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {product.price.toLocaleString()} MRU
            </span>
          )}
          {!hasDiscount && product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.comparePrice.toLocaleString()} MRU
            </span>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {inStock ? (
            <span className="text-emerald-600 font-semibold">{t(locale, "shopInStock")}</span>
          ) : (
            <span className="text-red-500 font-semibold">{t(locale, "shopOutOfStock")}</span>
          )}
        </div>

        <div className="mt-4 pt-1 mt-auto">
          <BuyButton productId={product.id} locale={locale} />
        </div>
      </div>
    </div>
  );
}
