"use client";

import BuyButton from "@/components/shop/BuyButton";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    inventory: { quantity: number } | null;
  };
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const imageSrc = product.images?.[0] || null;

  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-gray-200
        shadow-lg
        hover:shadow-xl
        hover:border-[#F5C542]/40
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Product Image */}
      <div
        className="
          h-64
          bg-gray-50
          flex
          items-center
          justify-center
          overflow-hidden
          relative
        "
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="
              w-full
              h-full
              object-contain
              p-6
              group-hover:scale-105
              transition-transform
              duration-500
            "
          />
        ) : (
          <div className="text-gray-400 text-sm">لا توجد صورة</div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 bg-white">
        <h2
          className="
            text-xl
            font-bold
            text-gray-900
            line-clamp-2
            min-h-[56px]
          "
        >
          {product.name}
        </h2>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#F5C542]">
              {product.price.toLocaleString()} MRU
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through mr-2">
                {product.comparePrice.toLocaleString()} MRU
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          المخزون:{" "}
          <span className="font-semibold">
            {product.inventory?.quantity ?? 0}
          </span>
        </div>

        <div className="mt-5">
          <BuyButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
