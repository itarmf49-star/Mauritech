"use client";

import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n";

type Store = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  logoUrl: string | null;
  _count?: { products: number };
};

type StoreRailProps = {
  locale: Locale;
  stores: Store[];
  activeSlug?: string;
};

export function StoreRail({ locale, stores, activeSlug }: StoreRailProps) {
  if (stores.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{t(locale, "shopBrowseByStore")}</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        <Link
          href={localePath(locale, "/")}
          className={`shrink-0 flex flex-col items-center gap-2 rounded-2xl border bg-white px-5 py-3 min-w-[100px] shadow-sm hover:shadow-md transition-all duration-300 ${
            !activeSlug ? "border-[#FF9900] ring-1 ring-[#FF9900]" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">∎</div>
          <span className="text-gray-700 text-xs font-semibold text-center">{t(locale, "shopAllStores")}</span>
        </Link>
        {stores.map((s) => (
          <Link
            key={s.id}
            href={localePath(locale, `/store/${s.slug}`)}
            className={`shrink-0 flex flex-col items-center gap-2 rounded-2xl border bg-white px-5 py-3 min-w-[100px] shadow-sm hover:shadow-md transition-all duration-300 ${
              activeSlug === s.slug ? "border-[#FF9900] ring-1 ring-[#FF9900]" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 text-xs font-bold">
              {s.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.logoUrl} alt="" className="h-full w-full object-contain p-1" />
              ) : (
                (locale === "ar" ? s.nameAr : s.nameFr).slice(0, 2)
              )}
            </div>
            <span className="text-gray-700 text-xs font-semibold text-center line-clamp-1">
              {locale === "ar" ? s.nameAr : s.nameFr}
            </span>
            {s._count && <span className="text-gray-400 text-[10px]">{s._count.products} {t(locale, "shopProductsSuffix")}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
