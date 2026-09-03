import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, resolveTargetStoreId, storeWhereFilter } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const url = new URL(req.url);
    const storeIdParam = url.searchParams.get("storeId") || "";
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);

    const where = scope.isSuperAdmin && !storeIdParam
      ? {}
      : storeWhereFilter(scope, storeIdParam);

    const offers = await prisma.offer.findMany({
      where,
      include: { products: { include: { product: { select: { id: true, name: true, nameAr: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    const stores = scope.isSuperAdmin
      ? await prisma.store.findMany({ select: { id: true, nameFr: true, nameAr: true } })
      : await prisma.store.findMany({ where: { id: { in: scope.storeIds } }, select: { id: true, nameFr: true, nameAr: true } });

    return NextResponse.json({ offers, stores, isSuperAdmin: scope.isSuperAdmin });
  } catch (e) {
    console.error("[api/admin/offers GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    if (!isNonEmptyString(body.titleFr)) return NextResponse.json({ error: "titleFr is required" }, { status: 400 });
    if (!isNonEmptyString(body.titleAr)) return NextResponse.json({ error: "titleAr is required" }, { status: 400 });

    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    // storeId فارغ = عرض عام على مستوى المنصة (السوبر أدمن فقط)
    let storeId: string | null = null;
    if (body.storeId) {
      storeId = await resolveTargetStoreId(scope, body.storeId);
      if (!storeId) return NextResponse.json({ error: "Forbidden store" }, { status: 403 });
    } else if (!scope.isSuperAdmin) {
      storeId = await resolveTargetStoreId(scope, null);
    }

    const offer = await prisma.offer.create({
      data: {
        storeId,
        titleFr: body.titleFr.trim(),
        titleAr: body.titleAr.trim(),
        bodyFr: body.bodyFr?.trim() || null,
        bodyAr: body.bodyAr?.trim() || null,
        bannerImage: body.bannerImage?.trim() || null,
        discountType: ["PERCENT", "FIXED", "NONE"].includes(body.discountType) ? body.discountType : "NONE",
        discountValue: body.discountValue ? Number(body.discountValue) : null,
        code: isNonEmptyString(body.code) ? body.code.trim().toUpperCase() : null,
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        endsAt: body.endsAt ? new Date(body.endsAt) : null,
        isActive: body.isActive ?? true,
        products: Array.isArray(body.productIds) && body.productIds.length
          ? { create: body.productIds.map((productId: string) => ({ productId })) }
          : undefined,
      },
      include: { products: true },
    });

    return NextResponse.json({ offer }, { status: 201 });
  } catch (e) {
    console.error("[api/admin/offers POST]", e);
    return databaseUnavailableResponse();
  }
}
