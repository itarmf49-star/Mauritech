"use client";

import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count?: { products: number };
};

type CategoryTilesProps = {
  locale: Locale;
  categories: Category[];
  onSelect?: (id: string) => void;
};

export function CategoryTiles({ locale, categories, onSelect }: CategoryTilesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {categories.slice(0, 12).map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect?.(c.id)}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300 transition-all duration-300 p-4 flex flex-col items-center gap-3 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-400 text-lg font-bold">{c.name.slice(0, 1)}</span>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-800 line-clamp-2">{c.name}</span>
        </button>
      ))}
    </section>
  );
}
