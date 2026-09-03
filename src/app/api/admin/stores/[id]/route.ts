import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, canAccessStore } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!canAccessStore(scope, id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true, orders: true } },
        storeUsers: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
    if (!store) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ store });
  } catch (e) {
    console.error("[api/admin/stores/:id GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!canAccessStore(scope, id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const data: Record<string, unknown> = {};
    for (const key of ["nameFr", "nameAr", "descriptionFr", "descriptionAr", "logoUrl", "bannerUrl", "currency"] as const) {
      if (typeof body[key] === "string") data[key] = body[key].trim() || null;
    }
    // فقط السوبر أدمن يفعّل/يعطّل متجراً كاملاً
    if (scope.isSuperAdmin && typeof body.isActive === "boolean") data.isActive = body.isActive;

    const store = await prisma.store.update({ where: { id }, data });
    return NextResponse.json({ store });
  } catch (e) {
    console.error("[api/admin/stores/:id PATCH]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!scope.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.store.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/stores/:id DELETE]", e);
    return databaseUnavailableResponse();
  }
}
