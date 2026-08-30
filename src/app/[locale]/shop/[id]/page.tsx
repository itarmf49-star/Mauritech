import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { AmazonNav } from "@/components/shop/amazon-nav";
import { LightBeamBackground } from "@/components/shop/light-beam-background";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Check, Truck, Shield, Clock } from "lucide-react";

type ProductPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProduct(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/inventory`, {
      cache: "no-store",
    });
    const data = await response.json();
    
    if (data.success && data.items && data.items.length > 0) {
      return data.items.find((item: any) => item.id === id);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === "fr" ? "Produit non trouvé" : "المنتج غير موجود"}
          </h1>
          <Link href={`/${locale}/shop`} prefetch={true} className="text-yellow-600 hover:text-yellow-700 font-medium">
            {locale === "fr" ? "Retour à la boutique" : "العودة إلى المتجر"}
          </Link>
        </div>
      </div>
    );
  }

  const productName = locale === "fr" ? product.nameFr : product.nameAr;
  const isArabic = locale === "ar";

  return (
    <LightBeamBackground>
      <AmazonNav locale={locale as "fr" | "ar"} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href={`/${locale}/shop`} 
            prefetch={true}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "fr" ? "Retour à la boutique" : "العودة إلى المتجر"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex items-center justify-center shadow-sm">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={productName}
                className="max-w-full max-h-96 object-contain"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">
                  {locale === "fr" ? "Image non disponible" : "الصورة غير متاحة"}
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
              <p className="text-gray-600">{product.manufacturer} • {product.model}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span className="text-gray-600 text-sm">4.5 (42 {locale === "fr" ? "avis" : "تقييمات"})</span>
            </div>

            {/* Price */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {product.isOnSale && product.discountPercent > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      MRU {(product.priceMRU * (1 - product.discountPercent / 100)).toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      MRU {product.priceMRU.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      -{product.discountPercent}%
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {locale === "fr" ? "Prix de vente jusqu'au" : "سعر البيع حتى"} {product.saleEndDate}
                  </p>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  MRU {product.priceMRU.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stockStatus === "AVAILABLE" ? (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="w-4 h-4" />
                  {locale === "fr" ? "En stock" : "متوفر"}
                </span>
              ) : product.stockStatus === "LOW_STOCK" ? (
                <span className="flex items-center gap-1 text-yellow-600">
                  <Clock className="w-4 h-4" />
                  {locale === "fr" ? "Stock limité" : "مخزون محدود"}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <Clock className="w-4 h-4" />
                  {locale === "fr" ? "Rupture de stock" : "نفذ المخزون"}
                </span>
              )}
              <span className="text-gray-500">• {product.stockQuantity} {locale === "fr" ? "unités" : "وحدات"}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                <ShoppingCart className="w-5 h-5" />
                {locale === "fr" ? "Ajouter au panier" : "إضافة إلى السلة"}
              </button>
              <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">
                {locale === "fr" ? "Caractéristiques" : "المميزات"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Truck className="w-5 h-5 text-yellow-600" />
                  <span>{locale === "fr" ? "Livraison gratuite à Nouakchott" : "توصيل مجاني إلى نواكشوط"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-yellow-600" />
                  <span>{locale === "fr" ? "Garantie 2 ans" : "ضمان لمدة عامين"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span>{locale === "fr" ? "Installation professionnelle disponible" : "تركيب احترافي متاح"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {locale === "fr" ? "Spécifications" : "المواصفات"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">{locale === "fr" ? "Fabricant" : "الشركة المصنعة"}</p>
              <p className="text-gray-900 font-medium">{product.manufacturer}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">{locale === "fr" ? "Modèle" : "الطراز"}</p>
              <p className="text-gray-900 font-medium">{product.model}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">{locale === "fr" ? "Type d'appareil" : "نوع الجهاز"}</p>
              <p className="text-gray-900 font-medium">{product.deviceType}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">{locale === "fr" ? "Prix USD" : "سعر بالدولار"}</p>
              <p className="text-gray-900 font-medium">${product.priceUSD}</p>
            </div>
          </div>
        </div>
      </div>
    </LightBeamBackground>
  );
}
