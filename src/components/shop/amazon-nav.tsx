"use client";

import { useState, useEffect } from "react";
import { Search, Menu, ChevronDown, ShoppingCart, User, Heart, Globe } from "lucide-react";
import Link from "next/link";

interface AmazonNavProps {
  locale: "fr" | "ar";
}

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  icon?: string;
  subcategories?: { id: string; nameFr: string; nameAr: string; slug: string }[];
}

export function AmazonNav({ locale }: AmazonNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/admin/content/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([
          { id: "tech", nameFr: "High-Tech", nameAr: "هاي تك", slug: "high-tech" },
          { id: "home", nameFr: "Maison", nameAr: "المنزل", slug: "maison" },
          { id: "garden", nameFr: "Jardin", nameAr: "الحديقة", slug: "jardin" },
          { id: "network", nameFr: "Réseau", nameAr: "الشبكات", slug: "reseau" },
          { id: "security", nameFr: "Sécurité", nameAr: "الأمن", slug: "securite" },
        ]);
      }
    };
    loadCategories();
  }, []);

  const isRTL = locale === "ar";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} prefetch={true} className="text-2xl font-bold text-gray-900">
            MauriTech
          </Link>

          {/* Delivery Location */}
          <div className="hidden md:flex items-center gap-2 text-gray-900 text-sm">
            <span className="text-gray-600">{locale === "fr" ? "Livraison à" : "التوصيل إلى"}</span>
            <span className="font-bold">{locale === "fr" ? "Nouakchott" : "نواكشوط"}</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="flex">
              <div className="relative flex-1">
                <select className={`absolute ${isRTL ? 'right-0' : 'left-0'} bg-white border-r border-gray-300 text-gray-900 text-sm px-3 py-2.5 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-medium`}>
                  <option>{locale === "fr" ? "Toutes catégories" : "جميع الفئات"}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {locale === "fr" ? cat.nameFr : cat.nameAr}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder={locale === "fr" ? "Rechercher MauriTech" : "بحث في MauriTech"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-24' : 'pl-24'} bg-white border border-gray-300 text-gray-900 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-medium`}
                />
              </div>
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2.5 rounded-r-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition shadow-md">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/portal`} prefetch={true} className="hidden md:flex flex-col items-center text-gray-900 hover:text-yellow-600 transition">
              <User className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{locale === "fr" ? "Compte" : "حساب"}</span>
            </Link>
            <Link href={`/${locale}/shop/wishlist`} prefetch={true} className="hidden md:flex flex-col items-center text-gray-900 hover:text-yellow-600 transition">
              <Heart className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{locale === "fr" ? "Liste" : "القائمة"}</span>
            </Link>
            <Link href={`/${locale}/shop/cart`} prefetch={true} className="flex flex-col items-center text-gray-900 hover:text-yellow-600 transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{locale === "fr" ? "Panier" : "السلة"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 hover:text-yellow-600 transition font-medium"
              style={{ color: "#1a202c" }}
            >
              <Menu className="w-5 h-5" style={{ color: "#1a202c" }} />
              <span>{locale === "fr" ? "Tout" : "الكل"}</span>
            </button>

            <div className="hidden md:flex items-center gap-6 overflow-x-auto">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/shop/category/${category.slug}`}
                  prefetch={true}
                  className="hover:text-yellow-600 whitespace-nowrap transition text-sm font-medium"
                  style={{ color: "#1a202c" }}
                >
                  {locale === "fr" ? category.nameFr : category.nameAr}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/shop/category/${category.slug}`}
                prefetch={true}
                className="hover:text-yellow-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
                style={{ color: "#1a202c" }}
              >
                {locale === "fr" ? category.nameFr : category.nameAr}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
