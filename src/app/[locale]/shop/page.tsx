import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { AmazonNav } from "@/components/shop/amazon-nav";
import { LightBeamBackground } from "@/components/shop/light-beam-background";
import { NetworkEquipmentCard } from "@/components/shop/network-equipment-card";
import Link from "next/link";

type ShopPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getInventory() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/inventory`, {
      cache: "no-store",
    });
    const data = await response.json();
    
    if (data.success && data.items && data.items.length > 0) {
      return data.items;
    }
    
    return [
      {
        id: "sample-1",
        nameFr: "Huawei AX3 Pro Wi-Fi 6",
        nameAr: "هواوي AX3 Pro Wi-Fi 6",
        manufacturer: "Huawei",
        deviceType: "ROUTER",
        model: "AX3 Pro",
        priceMRU: 45000,
        priceUSD: 1200,
        stockQuantity: 15,
        stockStatus: "AVAILABLE",
        isFeatured: true,
        imageUrl: "",
        discountPercent: 10,
        isOnSale: true,
        saleEndDate: "2025-03-01",
      },
      {
        id: "sample-2",
        nameFr: "Ubiquiti UniFi AP LR",
        nameAr: "أوبيكيتي UniFi AP LR",
        manufacturer: "Ubiquiti",
        deviceType: "ACCESS_POINT",
        model: "UniFi AP LR",
        priceMRU: 32000,
        priceUSD: 850,
        stockQuantity: 8,
        stockStatus: "AVAILABLE",
        isFeatured: true,
        imageUrl: "",
        discountPercent: 0,
        isOnSale: false,
        saleEndDate: null,
      },
      {
        id: "sample-3",
        nameFr: "Cisco Catalyst 2960",
        nameAr: "سيسكو Catalyst 2960",
        manufacturer: "Cisco",
        deviceType: "SWITCH",
        model: "Catalyst 2960",
        priceMRU: 120000,
        priceUSD: 3200,
        stockQuantity: 5,
        stockStatus: "LOW_STOCK",
        isFeatured: false,
        imageUrl: "",
        discountPercent: 15,
        isOnSale: true,
        saleEndDate: "2025-02-28",
      },
      {
        id: "sample-4",
        nameFr: "TP-Link Omada Mesh",
        nameAr: "تي-لينك Omada Mesh",
        manufacturer: "TP-Link",
        deviceType: "MESH_NODE",
        model: "Omada EAP",
        priceMRU: 18000,
        priceUSD: 480,
        stockQuantity: 25,
        stockStatus: "AVAILABLE",
        isFeatured: false,
        imageUrl: "",
        discountPercent: 0,
        isOnSale: false,
        saleEndDate: null,
      },
      {
        id: "sample-5",
        nameFr: "Mikrotik hAP ac²",
        nameAr: "ميكروتيك hAP ac²",
        manufacturer: "Mikrotik",
        deviceType: "ROUTER",
        model: "hAP ac²",
        priceMRU: 25000,
        priceUSD: 670,
        stockQuantity: 12,
        stockStatus: "AVAILABLE",
        isFeatured: true,
        imageUrl: "",
        discountPercent: 5,
        isOnSale: true,
        saleEndDate: "2025-03-15",
      },
      {
        id: "sample-6",
        nameFr: "Aruba Instant On",
        nameAr: "أروبا Instant On",
        manufacturer: "Aruba",
        deviceType: "ACCESS_POINT",
        model: "Instant On",
        priceMRU: 55000,
        priceUSD: 1470,
        stockQuantity: 3,
        stockStatus: "LOW_STOCK",
        isFeatured: false,
        imageUrl: "",
        discountPercent: 0,
        isOnSale: false,
        saleEndDate: null,
      },
    ];
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [
      {
        id: "sample-1",
        nameFr: "Huawei AX3 Pro Wi-Fi 6",
        nameAr: "هواوي AX3 Pro Wi-Fi 6",
        manufacturer: "Huawei",
        deviceType: "ROUTER",
        model: "AX3 Pro",
        priceMRU: 45000,
        priceUSD: 1200,
        stockQuantity: 15,
        stockStatus: "AVAILABLE",
        isFeatured: true,
        imageUrl: "",
        discountPercent: 10,
        isOnSale: true,
        saleEndDate: "2025-03-01",
      },
    ];
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const products = await getInventory();

  return (
    <LightBeamBackground>
      <AmazonNav locale={locale as "fr" | "ar"} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {locale === "fr" ? "Tous les produits" : "جميع المنتجات"}
        </h1>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/${locale}/shop/${product.id}`}
                prefetch={true}
                className="block"
              >
                <NetworkEquipmentCard
                  product={product}
                  locale={locale as "fr" | "ar"}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <p className="text-gray-600 text-lg">
                {locale === "fr" ? "Aucun produit disponible" : "لا توجد منتجات متاحة"}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {locale === "fr" 
                  ? "Revenez plus tard ou contactez-nous pour des solutions personnalisées" 
                  : "عد لاحقاً أو اتصل بنا للحصول على حلول مخصصة"}
              </p>
            </div>
          </div>
        )}
      </div>
    </LightBeamBackground>
  );
}
