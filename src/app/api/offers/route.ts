import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** العروض النشطة حالياً (ضمن نطاق التاريخ إن وُجد) — لعرضها في بانر المتجر. */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");
    const now = new Date();

    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
        ...(storeId ? { OR: [{ storeId }, { storeId: null }] } : {}),
      },
      include: {
        store: { select: { slug: true, nameFr: true, nameAr: true } },
        products: { select: { productId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json(
      { offers },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
    );
  } catch (e) {
    console.error("[api/offers GET]", e);
    return databaseUnavailableResponse();
  }
}
