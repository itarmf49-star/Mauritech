"use client";

import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n";

type Offer = {
  id: string;
  titleFr: string;
  titleAr: string;
  bodyFr: string | null;
  bodyAr: string | null;
  bannerImage: string | null;
  discountType: "PERCENT" | "FIXED" | "NONE";
  discountValue: number | null;
  code: string | null;
  products?: { productId: string }[];
};

type OffersBannerProps = {
  locale: Locale;
  offers: Offer[];
};

export function OffersBanner({ locale, offers }: OffersBannerProps) {
  if (offers.length === 0) return null;

  return (
    <section className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#8B5FBF] to-[#5B3A8E] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{t(locale, "shopActiveOffers")}</h2>
        <Link href={localePath(locale, "/#products")} className="text-white/80 text-sm font-semibold hover:text-white flex items-center gap-1">
          {t(locale, "shopAllStores")} ›
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {offers.map((o) => (
          <div key={o.id} className="shrink-0 w-[240px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative">
            {o.discountType !== "NONE" && o.discountValue ? (
              <span className="absolute top-2 start-2 z-10 bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded">
                {o.discountType === "PERCENT" ? `-${o.discountValue}%` : `-${o.discountValue.toLocaleString()} MRU`}
              </span>
            ) : null}
            {o.bannerImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={o.bannerImage} alt="" className="h-28 w-full object-cover" />
            ) : (
              <div className="h-28 w-full bg-gradient-to-br from-purple-100 to-purple-50" />
            )}
            <div className="p-3">
              <p className="text-gray-900 font-bold text-sm line-clamp-1">{locale === "ar" ? o.titleAr : o.titleFr}</p>
              {(locale === "ar" ? o.bodyAr : o.bodyFr) && (
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{locale === "ar" ? o.bodyAr : o.bodyFr}</p>
              )}
              {o.code && (
                <span className="inline-block mt-2 text-[11px] font-mono bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-600">
                  {t(locale, "shopOfferCode")}: {o.code}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
