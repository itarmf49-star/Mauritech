export type ProductOffer = {
  offer: {
    discountType: "PERCENT" | "FIXED" | "NONE";
    discountValue: number | null;
    titleFr?: string;
    titleAr?: string;
    code?: string | null;
  };
};

/** يحسب أفضل سعر بعد الخصم من قائمة العروض النشطة المرتبطة بمنتج. */
export function computeDiscountedPrice(price: number, offerProducts: ProductOffer[] | undefined) {
  if (!offerProducts || offerProducts.length === 0) return { finalPrice: price, appliedOffer: null as ProductOffer["offer"] | null };

  let best = price;
  let bestOffer: ProductOffer["offer"] | null = null;

  for (const { offer } of offerProducts) {
    if (offer.discountType === "NONE" || !offer.discountValue) continue;
    const candidate =
      offer.discountType === "PERCENT"
        ? Math.round(price * (1 - offer.discountValue / 100))
        : Math.max(0, price - offer.discountValue);
    if (candidate < best) {
      best = candidate;
      bestOffer = offer;
    }
  }

  return { finalPrice: best, appliedOffer: bestOffer };
}
