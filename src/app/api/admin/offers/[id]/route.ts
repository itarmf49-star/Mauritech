import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, canAccessStore } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

async function assertAccess(offerId: string, userId: number | string, role: string | undefined) {
  const offer = await prisma.offer.findUnique({ where: { id: offerId }, select: { storeId: true } });
  if (!offer) return { ok: false as const, status: 404 };
  const scope = await getStoreScope(userId, role);
  if (offer.storeId === null && !scope.isSuperAdmin) return { ok: false as const, status: 403 };
  if (offer.storeId !== null && !canAccessStore(scope, offer.storeId)) return { ok: false as const, status: 403 };
  return { ok: true as const };
}

export async function PATCH(req: Request, { params }: Params) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const access = await assertAccess(id, staff.session.user.id, staff.session.user.role);
    if (!access.ok) return NextResponse.json({ error: "Forbidden or not found" }, { status: access.status });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const data: Record<string, unknown> = {};
    for (const key of ["titleFr", "titleAr", "bodyFr", "bodyAr", "bannerImage", "code"] as const) {
      if (typeof body[key] === "string") data[key] = body[key].trim() || null;
    }
    if (["PERCENT", "FIXED", "NONE"].includes(body.discountType)) data.discountType = body.discountType;
    if (body.discountValue !== undefined) data.discountValue = body.discountValue ? Number(body.discountValue) : null;
    if (body.startsAt !== undefined) data.startsAt = body.startsAt ? new Date(body.startsAt) : null;
    if (body.endsAt !== undefined) data.endsAt = body.endsAt ? new Date(body.endsAt) : null;
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    if (Array.isArray(body.productIds)) {
      await prisma.offerProduct.deleteMany({ where: { offerId: id } });
      if (body.productIds.length) {
        await prisma.offerProduct.createMany({
          data: body.productIds.map((productId: string) => ({ offerId: id, productId })),
          skipDuplicates: true,
        });
      }
    }

    const offer = await prisma.offer.update({
      where: { id },
      data,
      include: { products: { include: { product: { select: { id: true, name: true, nameAr: true } } } } },
    });

    return NextResponse.json({ offer });
  } catch (e) {
    console.error("[api/admin/offers/:id PATCH]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const access = await assertAccess(id, staff.session.user.id, staff.session.user.role);
    if (!access.ok) return NextResponse.json({ error: "Forbidden or not found" }, { status: access.status });

    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/offers/:id DELETE]", e);
    return databaseUnavailableResponse();
  }
}
