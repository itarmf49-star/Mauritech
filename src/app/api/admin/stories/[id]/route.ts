import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, canAccessStore } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

async function assertAccess(storyId: string, userId: number | string, role: string | undefined) {
  const story = await prisma.story.findUnique({ where: { id: storyId }, select: { storeId: true } });
  if (!story) return { ok: false as const, status: 404 };
  const scope = await getStoreScope(userId, role);
  if (story.storeId === null && !scope.isSuperAdmin) return { ok: false as const, status: 403 };
  if (story.storeId !== null && !canAccessStore(scope, story.storeId)) return { ok: false as const, status: 403 };
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
    for (const key of ["titleFr", "titleAr", "bodyFr", "bodyAr", "coverImage"] as const) {
      if (typeof body[key] === "string") data[key] = body[key].trim() || null;
    }
    if (typeof body.productId === "string") data.productId = body.productId || null;
    if (["STORY", "ARTICLE", "PRODUCT_STORY"].includes(body.type)) data.type = body.type;
    if (typeof body.isPublished === "boolean") {
      data.isPublished = body.isPublished;
      if (body.isPublished) data.publishedAt = new Date();
    }

    const story = await prisma.story.update({ where: { id }, data });
    return NextResponse.json({ story });
  } catch (e) {
    console.error("[api/admin/stories/:id PATCH]", e);
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

    await prisma.story.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/stories/:id DELETE]", e);
    return databaseUnavailableResponse();
  }
}
