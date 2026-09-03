import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** صفحة متجر عامة (Storefront) — تفاصيل المتجر ومنتجاته النشطة. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        slug: true,
        nameFr: true,
        nameAr: true,
        descriptionFr: true,
        descriptionAr: true,
        logoUrl: true,
        bannerUrl: true,
        currency: true,
      },
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const products = await prisma.product.findMany({
      where: { storeId: store.id, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        inventory: true,
        offerProducts: {
          where: { offer: { isActive: true } },
          include: { offer: { select: { discountType: true, discountValue: true, titleFr: true, titleAr: true } } },
        },
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const withRatings = products.map(({ reviews, ...p }) => {
      const count = reviews.length;
      const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
      return { ...p, rating: Math.round(avg * 10) / 10, reviewCount: count };
    });

    return NextResponse.json({ store, products: withRatings });
  } catch (e) {
    console.error("[api/stores/[slug] GET]", e);
    return databaseUnavailableResponse();
  }
}
