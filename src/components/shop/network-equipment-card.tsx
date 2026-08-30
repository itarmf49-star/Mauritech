"use client";

import { useState } from "react";
import { ShoppingCart, Package, Wifi, Users, Zap, Check, AlertTriangle, X, Percent, Tag } from "lucide-react";

interface Product {
  id: string;
  nameFr: string;
  nameAr: string;
  manufacturer: string;
  deviceType: string;
  model?: string;
  priceMRU: number;
  priceUSD?: number;
  coverageRadiusM?: number;
  maxUsers?: number;
  wifiStandard?: string;
  ports?: number;
  powerWatts?: number;
  imageUrl?: string;
  specifications?: string;
  stockQuantity: number;
  stockStatus: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";
  isFeatured: boolean;
  discountPercent?: number;
  isOnSale?: boolean;
  saleEndDate?: string;
}

interface NetworkEquipmentCardProps {
  product: Product;
  locale: "fr" | "ar";
}

export function NetworkEquipmentCard({ product, locale }: NetworkEquipmentCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const isRTL = locale === "ar";

  const {
    id,
    nameFr,
    nameAr,
    manufacturer,
    deviceType,
    model,
    priceMRU,
    priceUSD,
    coverageRadiusM,
    maxUsers,
    powerWatts,
    imageUrl,
    specifications,
    stockQuantity,
    stockStatus,
    isFeatured,
    discountPercent,
    isOnSale,
    saleEndDate,
  } = product;

  const displayName = locale === "fr" ? (nameFr || "Produit") : (nameAr || "منتج");
  const currency = locale === "fr" ? "MRU" : "أ.م.م";
  const price = priceMRU || 0;
  const discount = discountPercent || 0;

  const getStockBadge = () => {
    switch (stockStatus) {
      case "AVAILABLE":
        return { text: locale === "fr" ? "En stock" : "متوفر", color: "bg-green-500 text-white", icon: Check };
      case "LOW_STOCK":
        return { text: locale === "fr" ? "Stock limite" : "مخزون محدود", color: "bg-yellow-500 text-white", icon: AlertTriangle };
      case "OUT_OF_STOCK":
        return { text: locale === "fr" ? "Rupture" : "نفذ المخزون", color: "bg-red-500 text-white", icon: X };
      case "PRE_ORDER":
        return { text: locale === "fr" ? "Pre-commande" : "طلب مسبق", color: "bg-blue-500 text-white", icon: Package };
    }
  };

  const stockBadge = getStockBadge();
  const StockIcon = stockBadge.icon;

  const specs = [
    { icon: Wifi, label: locale === "fr" ? "Couverture" : "التغطية", value: coverageRadiusM ? `${coverageRadiusM}m` : "-" },
    { icon: Users, label: locale === "fr" ? "Utilisateurs" : "المستخدمين", value: maxUsers?.toString() || "-" },
    { icon: Zap, label: locale === "fr" ? "Puissance" : "الطاقة", value: powerWatts ? `${powerWatts}W` : "-" },
  ];

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountedPrice = discount > 0
    ? price * (1 - discount / 100)
    : null;

  return (
    <div className="group relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-yellow-500 hover:shadow-xl shadow-md">
      {isFeatured && (
        <div className="absolute top-3 right-3 z-20">
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-md">
            {locale === "fr" ? "Vedette" : "مميز"}
          </span>
        </div>
      )}

      {isOnSale && discount > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-md">
            <Percent className="w-3 h-3" />
            -{discount}%
          </span>
        </div>
      )}

      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-20">
          <span className={`px-3 py-1 ${stockBadge.color} text-xs font-bold rounded-full flex items-center gap-1 shadow-sm`}>
            <StockIcon className="w-3 h-3" />
            {stockBadge.text}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs text-yellow-600 font-semibold mb-1 truncate">
          {manufacturer} {model && ` • ${model}`}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-tight">
          {displayName}
        </h3>
        <div className="text-xs text-gray-600 mb-3 font-medium">
          {deviceType}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {specs.map((spec, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
              <spec.icon className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
              <div className="text-xs text-gray-900 font-bold">{spec.value}</div>
              <div className="text-[10px] text-gray-600 font-medium leading-tight">{spec.label}</div>
            </div>
          ))}
        </div>

        {specifications && (
          <div className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {specifications}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {discountedPrice ? (
              <>
                <div className="text-2xl font-bold text-red-600">
                  {discountedPrice.toLocaleString()} {currency}
                </div>
                <div className="text-xs text-gray-500 line-through font-medium">
                  {price.toLocaleString()} {currency}
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {price.toLocaleString()} {currency}
                </div>
                {priceUSD && (
                  <div className="text-xs text-gray-500 font-medium">
                    ≈ ${(priceUSD || 0).toFixed(2)} USD
                  </div>
                )}
              </>
            )}
          </div>
          <div className="text-right ml-3 flex-shrink-0">
            <div className="text-xs text-gray-600 font-medium">
              {locale === "fr" ? "Stock" : "المخزون"}
            </div>
            <div className="text-sm font-bold text-gray-900">
              {stockQuantity || 0}
            </div>
          </div>
        </div>

        {isOnSale && saleEndDate && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-red-600">
              <Tag className="w-3 h-3" />
              {locale === "fr" ? `Promotion jusqu'au ${saleEndDate}` : `عرض حتى ${saleEndDate}`}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={stockStatus === "OUT_OF_STOCK"}
          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-green-600 text-white hover:bg-green-700"
              : stockStatus === "OUT_OF_STOCK"
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              {locale === "fr" ? "Ajoute" : "تمت الإضافة"}
            </>
          ) : stockStatus === "OUT_OF_STOCK" ? (
            <>
              <X className="w-4 h-4" />
              {locale === "fr" ? "Rupture" : "نفذ المخزون"}
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {locale === "fr" ? "Ajouter au panier" : "أضف للسلة"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}