"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Filter, Star, Grid, List, Heart, Share2, Megaphone } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import Link from "next/link";

interface AmazonShopLayoutProps {
  locale: string;
  children: React.ReactNode;
}

interface Banner {
  id: string;
  titleFr: string;
  titleAr: string;
  subtitleFr: string;
  subtitleAr: string;
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

export function AmazonShopLayout({ locale, children }: AmazonShopLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Load banners from admin content
    const loadBanners = async () => {
      try {
        const response = await fetch('/api/admin/content/banners');
        if (response.ok) {
          const data = await response.json();
          setBanners(data.banners || []);
        }
      } catch (error) {
        console.error('Failed to load banners:', error);
        setBanners([{
          id: "sample-1",
          titleFr: "Offre Spéciale - Wi-Fi 6",
          titleAr: "عرض خاص - Wi-Fi 6",
          subtitleFr: "Jusqu'à -20% sur les routeurs Wi-Fi 6",
          subtitleAr: "خصم يصل إلى 20% على راوترات Wi-Fi 6",
          imageUrl: "",
          link: "/shop",
          order: 1,
          isActive: true,
        }]);
      }
    };

    // Load categories from admin content
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/admin/content/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadBanners();
    loadCategories();
  }, []);

  const displayCategories = categories.length > 0 ? categories : [
    { id: "all", name: locale === "fr" ? "Tous les produits" : "جميع المنتجات" },
    { id: "routers", name: locale === "fr" ? "Routeurs" : "الراوترات" },
    { id: "access-points", name: locale === "fr" ? "Points d'accès" : "نقاط الوصول" },
    { id: "switches", name: locale === "fr" ? "Commutateurs" : "المبدلات" },
    { id: "cabling", name: locale === "fr" ? "Câblage" : "الكابلات" },
    { id: "security", name: locale === "fr" ? "Sécurité" : "الأمن" },
  ];

  const sortOptions = [
    { id: "featured", name: locale === "fr" ? "En vedette" : "المميزة" },
    { id: "price-low", name: locale === "fr" ? "Prix: croissant" : "السعر: تصاعدي" },
    { id: "price-high", name: locale === "fr" ? "Prix: décroissant" : "السعر: تنازلي" },
    { id: "rating", name: locale === "fr" ? "Évaluation" : "التقييم" },
    { id: "newest", name: locale === "fr" ? "Nouveautés" : "الأحدث" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banners Section */}
        {banners.filter(b => b.isActive).length > 0 && (
          <div className="mb-8 space-y-4">
            {banners.filter(b => b.isActive).sort((a, b) => a.order - b.order).map((banner) => (
              <Link
                key={banner.id}
                href={banner.link}
                prefetch={true}
                className="block"
              >
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {locale === "fr" ? banner.titleFr : banner.titleAr}
                    </h2>
                    <p className="text-gray-600 font-medium">
                      {locale === "fr" ? banner.subtitleFr : banner.subtitleAr}
                    </p>
                  </div>
                  <Megaphone className="absolute right-4 top-4 w-12 h-12 text-yellow-500/30" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* MauriTech-Style Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {locale === "fr" ? "Équipements Réseau" : "معدات الشبكات"}
              </h1>
              <p className="text-gray-600 font-medium">
                {locale === "fr" 
                  ? "Solutions réseau professionnelles pour vos besoins d'infrastructure" 
                  : "حلول الشبكات الاحترافية لاحتياجات البنية التحتية الخاصة بك"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder={locale === "fr" ? "Rechercher..." : "بحث..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <button className="p-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 hover:text-amber-600 hover:bg-gray-100 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {displayCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold"
                    : "bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-100 hover:text-amber-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`hidden lg:block w-64 flex-shrink-0 ${isFilterOpen ? 'lg:hidden' : ''}`}>
            <GlassCard className="p-6 bg-white border-2 border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">
                  {locale === "fr" ? "Filtres" : "تصفية"}
                </h3>
                <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                  {locale === "fr" ? "Tout effacer" : "مسح الكل"}
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  {locale === "fr" ? "Gamme de prix" : "نطاق السعر"}
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>MRU {priceRange[0].toLocaleString()}</span>
                    <span>MRU {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  {locale === "fr" ? "Marque" : "العلامة التجارية"}
                </h4>
                <div className="space-y-2">
                  {["Ubiquiti", "Cisco", "TP-Link", "Mikrotik", "Huawei"].map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer hover:text-gray-900">
                      <input type="checkbox" className="rounded border-gray-300 bg-white accent-yellow-500" />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  {locale === "fr" ? "Évaluation client" : "تقييم العملاء"}
                </h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer hover:text-gray-900">
                      <input type="checkbox" className="rounded border-gray-300 bg-white accent-yellow-500" />
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span>{locale === "fr" ? "& Plus" : "فأكثر"}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  {locale === "fr" ? "Disponibilité" : "التوفر"}
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" className="rounded border-gray-300 bg-white accent-yellow-500" />
                    {locale === "fr" ? "En stock" : "متوفر"}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" className="rounded border-gray-300 bg-white accent-yellow-500" />
                    {locale === "fr" ? "Précommande" : "طلب مسبق"}
                  </label>
                </div>
              </div>
            </GlassCard>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">
                  {locale === "fr" ? "Résultats: " : "النتائج: "}
                  {children ? '12' : '0'}
                </span>
                <select className="bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900" : "bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-100"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900" : "bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-100"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}