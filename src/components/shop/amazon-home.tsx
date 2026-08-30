"use client";

import { useState, useEffect } from "react";
import { AmazonNav } from "@/components/shop/amazon-nav";
import { LightBeamBackground } from "@/components/shop/light-beam-background";
import { ChevronLeft, ChevronRight, Clock, Tag, Star, ArrowRight, TrendingUp, Zap, Shield, Truck } from "lucide-react";
import Link from "next/link";

interface AmazonHomeProps {
  locale: "fr" | "ar";
}

interface PromoBanner {
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

interface CategoryShowcase {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface FlashDeal {
  id: string;
  nameFr: string;
  nameAr: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  imageUrl: string;
  endTime: string;
  order: number;
  isActive: boolean;
}

interface PromoBlock {
  id: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

export function AmazonHome({ locale }: AmazonHomeProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [categoryShowcases, setCategoryShowcases] = useState<CategoryShowcase[]>([]);
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [promoBlocks, setPromoBlocks] = useState<PromoBlock[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bannersRes, categoriesRes, dealsRes, promosRes] = await Promise.all([
          fetch('/api/admin/content/banners'),
          fetch('/api/admin/content/category-showcases'),
          fetch('/api/admin/content/flash-deals'),
          fetch('/api/admin/content/promo-blocks'),
        ]);

        if (bannersRes.ok) {
          const data = await bannersRes.json();
          setBanners(data.banners || []);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategoryShowcases(data.showcases || []);
        }
        if (dealsRes.ok) {
          const data = await dealsRes.json();
          setFlashDeals(data.deals || []);
        }
        if (promosRes.ok) {
          const data = await promosRes.json();
          setPromoBlocks(data.blocks || []);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback data
        setBanners([{
          id: "1",
          titleFr: "Offre Spéciale - Wi-Fi 6",
          titleAr: "عرض خاص - Wi-Fi 6",
          subtitleFr: "Jusqu'à -30% sur les routeurs Wi-Fi 6 de haute performance",
          subtitleAr: "خصم يصل إلى 30% على راوترات Wi-Fi 6 عالية الأداء",
          imageUrl: "",
          link: "/shop",
          order: 1,
          isActive: true,
        }]);
        setCategoryShowcases([
          { id: "1", nameFr: "High-Tech", nameAr: "هاي تك", slug: "high-tech", imageUrl: "", order: 1, isActive: true },
          { id: "2", nameFr: "Maison", nameAr: "المنزل", slug: "maison", imageUrl: "", order: 2, isActive: true },
          { id: "3", nameFr: "Jardin", nameAr: "الحديقة", slug: "jardin", imageUrl: "", order: 3, isActive: true },
          { id: "4", nameFr: "Réseau", nameAr: "الشبكات", slug: "reseau", imageUrl: "", order: 4, isActive: true },
          { id: "5", nameFr: "Sécurité", nameAr: "الأمن", slug: "securite", imageUrl: "", order: 5, isActive: true },
          { id: "6", nameFr: "Smart Home", nameAr: "المنزل الذكي", slug: "smart-home", imageUrl: "", order: 6, isActive: true },
        ]);
        setFlashDeals([
          {
            id: "1",
            nameFr: "Huawei AX3 Pro Wi-Fi 6",
            nameAr: "هواوي AX3 Pro Wi-Fi 6",
            originalPrice: 45000,
            discountPrice: 31500,
            discountPercent: 30,
            imageUrl: "",
            endTime: "23:59:59",
            order: 1,
            isActive: true,
          },
          {
            id: "2",
            nameFr: "Ubiquiti UniFi AP LR",
            nameAr: "أوبيكيتي UniFi AP LR",
            originalPrice: 32000,
            discountPrice: 22400,
            discountPercent: 30,
            imageUrl: "",
            endTime: "23:59:59",
            order: 2,
            isActive: true,
          },
          {
            id: "3",
            nameFr: "TP-Link Omada Mesh",
            nameAr: "تي-لينك Omada Mesh",
            originalPrice: 18000,
            discountPrice: 12600,
            discountPercent: 30,
            imageUrl: "",
            endTime: "23:59:59",
            order: 3,
            isActive: true,
          },
        ]);
        setPromoBlocks([
          {
            id: "1",
            titleFr: "Installation Gratuite",
            titleAr: "تركيب مجاني",
            descriptionFr: "Pour tout achat supérieur à 100,000 MRU",
            descriptionAr: "لجميع المشتريات التي تزيد عن 100,000 أ.م.م",
            imageUrl: "",
            link: "/shop",
            order: 1,
            isActive: true,
          },
          {
            id: "2",
            titleFr: "Garantie 2 Ans",
            titleAr: "ضمان لعامين",
            descriptionFr: "Sur tous les équipements réseau",
            descriptionAr: "على جميع معدات الشبكات",
            imageUrl: "",
            link: "/shop",
            order: 2,
            isActive: true,
          },
        ]);
      }
    };
    loadData();
  }, []);

  const isRTL = locale === "ar";
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);
  const activeCategories = categoryShowcases.filter(c => c.isActive).sort((a, b) => a.order - b.order);
  const activeDeals = flashDeals.filter(d => d.isActive).sort((a, b) => a.order - b.order);
  const activePromos = promoBlocks.filter(p => p.isActive).sort((a, b) => a.order - b.order);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <LightBeamBackground>
      <AmazonNav locale={locale} />

      {/* Hero Banner Carousel - Full Width */}
      {activeBanners.length > 0 && (
        <div className="relative bg-gradient-to-br from-white via-gray-50 to-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="relative">
              <Link
                href={activeBanners[currentBanner]?.link || "/shop"}
                prefetch={true}
                className="block"
              >
                <div className="bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 border-2 border-yellow-500 rounded-2xl p-8 md:p-16 relative overflow-hidden shadow-xl">
                  <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                      {locale === "fr" 
                        ? activeBanners[currentBanner]?.titleFr 
                        : activeBanners[currentBanner]?.titleAr}
                    </h2>
                    <p className="text-xl text-gray-800 mb-6 font-medium">
                      {locale === "fr" 
                        ? activeBanners[currentBanner]?.subtitleFr 
                        : activeBanners[currentBanner]?.subtitleAr}
                    </p>
                    <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition flex items-center gap-2 w-fit shadow-lg">
                      {locale === "fr" ? "Voir l'offre" : "عرض العرض"}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-yellow-400/20 to-transparent" />
                </div>
              </Link>

              {/* Navigation Arrows */}
              {activeBanners.length > 1 && (
                <>
                  <button
                    onClick={prevBanner}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} bg-white hover:bg-gray-50 text-gray-900 p-3 rounded-full transition border-2 border-yellow-500 hover:border-yellow-600 shadow-lg`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} bg-white hover:bg-gray-50 text-gray-900 p-3 rounded-full transition border-2 border-yellow-500 hover:border-yellow-600 shadow-lg`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dots */}
              {activeBanners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {activeBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        index === currentBanner ? "bg-yellow-500 w-6" : "bg-gray-400 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Promo Blocks Grid */}
      {activePromos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePromos.map((promo) => (
              <Link
                key={promo.id}
                href={promo.link}
                prefetch={true}
                className="block"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 transition group shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-500 p-3 rounded-lg shadow-md">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition">
                        {locale === "fr" ? promo.titleFr : promo.titleAr}
                      </h3>
                      <p className="text-gray-700 text-sm font-medium">
                        {locale === "fr" ? promo.descriptionFr : promo.descriptionAr}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category Grid Showcase - Professional Layout */}
      {activeCategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === "fr" ? "Parcourir par catégorie" : "تصفح حسب الفئة"}
            </h2>
            <Link href={`/${locale}/shop/categories`} prefetch={true} className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center gap-1 font-bold">
              {locale === "fr" ? "Voir tout" : "عرض الكل"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/shop/category/${category.slug}`}
                prefetch={true}
                className="block"
              >
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-yellow-500 transition group cursor-pointer shadow-md">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mb-3 flex items-center justify-center group-hover:from-yellow-100 group-hover:to-yellow-50 transition">
                    <span className="text-gray-600 text-sm font-bold group-hover:text-yellow-700 transition">
                      {locale === "fr" ? category.nameFr : category.nameAr}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-sm text-center group-hover:text-yellow-600 transition">
                    {locale === "fr" ? category.nameFr : category.nameAr}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Flash Deals Strip - Professional */}
      {activeDeals.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-y-2 border-red-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 p-2 rounded-lg shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {locale === "fr" ? "Ventes Flash" : "العروض السريعة"}
                  </h2>
                  <div className="flex items-center gap-1 text-gray-700 text-sm mt-1 font-medium">
                    <span className="bg-white px-2 py-1 rounded font-mono border border-gray-300">05</span>:
                    <span className="bg-white px-2 py-1 rounded font-mono border border-gray-300">23</span>:
                    <span className="bg-white px-2 py-1 rounded font-mono border border-gray-300">59</span>
                  </div>
                </div>
              </div>
              <Link href={`/${locale}/shop/deals`} prefetch={true} className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center gap-1 font-bold">
                {locale === "fr" ? "Voir tout" : "عرض الكل"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {activeDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/${locale}/shop/product/${deal.id}`}
                  prefetch={true}
                  className="flex-shrink-0 w-52 block"
                >
                  <div className="bg-white border-2 border-red-200 rounded-xl p-4 hover:border-red-500 transition group shadow-md">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-medium">Image</span>
                      </div>
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                        -{deal.discountPercent}%
                      </div>
                    </div>
                    <h3 className="text-gray-900 text-sm mb-2 line-clamp-2 font-bold group-hover:text-yellow-600 transition">
                      {locale === "fr" ? deal.nameFr : deal.nameAr}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-600 font-bold text-lg">
                        {deal.discountPrice.toLocaleString()} MRU
                      </span>
                      <span className="text-gray-500 text-sm line-through font-medium">
                        {deal.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 text-xs font-bold">
                        {locale === "fr" ? "Offre limitée" : "عرض محدود"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 flex items-center gap-4 shadow-md">
            <div className="bg-yellow-500 p-3 rounded-lg shadow-md">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold mb-1">
                {locale === "fr" ? "Livraison Gratuite" : "توصيل مجاني"}
              </h3>
              <p className="text-gray-700 text-sm font-medium">
                {locale === "fr" ? "À Nouakchott" : "إلى نواكشوط"}
              </p>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 flex items-center gap-4 shadow-md">
            <div className="bg-yellow-500 p-3 rounded-lg shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold mb-1">
                {locale === "fr" ? "Garantie 2 Ans" : "ضمان لعامين"}
              </h3>
              <p className="text-gray-700 text-sm font-medium">
                {locale === "fr" ? "Sur tous les produits" : "على جميع المنتجات"}
              </p>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 flex items-center gap-4 shadow-md">
            <div className="bg-yellow-500 p-3 rounded-lg shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold mb-1">
                {locale === "fr" ? "Installation Pro" : "تركيب احترافي"}
              </h3>
              <p className="text-gray-700 text-sm font-medium">
                {locale === "fr" ? "Par nos experts" : "بواسطة خبرائنا"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === "fr" ? "Recommandé pour vous" : "موصى به لك"}
          </h2>
          <Link href={`/${locale}/shop/recommended`} prefetch={true} className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center gap-1 font-bold">
            {locale === "fr" ? "Voir tout" : "عرض الكل"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Link
              key={i}
              href={`/${locale}/shop/product/sample-${i}`}
              prefetch={true}
              className="block"
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-yellow-500 transition group shadow-md">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500 text-xs font-medium">Image</span>
                </div>
                <h3 className="text-gray-900 text-sm mb-2 line-clamp-2 font-bold group-hover:text-yellow-600 transition">
                  {locale === "fr" ? `Produit ${i}` : `منتج ${i}`}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  ))}
                  <span className="text-gray-600 text-xs font-medium">42</span>
                </div>
                <p className="text-gray-900 font-bold">
                  {(i * 10000).toLocaleString()} MRU
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </LightBeamBackground>
  );
}
