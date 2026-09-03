import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, resolveTargetStoreId, storeWhereFilter } from "@/lib/store-scope";
import slugify from "slugify";

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

    const where = scope.isSuperAdmin && !storeIdParam ? {} : storeWhereFilter(scope, storeIdParam);

    const stories = await prisma.story.findMany({
      where,
      include: { product: { select: { id: true, name: true, nameAr: true } } },
      orderBy: { createdAt: "desc" },
    });

    const stores = scope.isSuperAdmin
      ? await prisma.store.findMany({ select: { id: true, nameFr: true, nameAr: true } })
      : await prisma.store.findMany({ where: { id: { in: scope.storeIds } }, select: { id: true, nameFr: true, nameAr: true } });

    return NextResponse.json({ stories, stores, isSuperAdmin: scope.isSuperAdmin });
  } catch (e) {
    console.error("[api/admin/stories GET]", e);
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
    if (!isNonEmptyString(body.bodyFr)) return NextResponse.json({ error: "bodyFr is required" }, { status: 400 });
    if (!isNonEmptyString(body.bodyAr)) return NextResponse.json({ error: "bodyAr is required" }, { status: 400 });

    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    let storeId: string | null = null;
    if (body.storeId) {
      storeId = await resolveTargetStoreId(scope, body.storeId);
      if (!storeId) return NextResponse.json({ error: "Forbidden store" }, { status: 403 });
    } else if (!scope.isSuperAdmin) {
      storeId = await resolveTargetStoreId(scope, null);
    }

    let baseSlug = slugify(body.slug?.trim() || body.titleFr, { lower: true, strict: true });
    if (!baseSlug) baseSlug = `story-${Date.now()}`;
    let slug = baseSlug;
    let n = 1;
    while (await prisma.story.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${baseSlug}-${++n}`;
    }

    const story = await prisma.story.create({
      data: {
        storeId,
        productId: isNonEmptyString(body.productId) ? body.productId : null,
        type: ["STORY", "ARTICLE", "PRODUCT_STORY"].includes(body.type) ? body.type : "STORY",
        slug,
        titleFr: body.titleFr.trim(),
        titleAr: body.titleAr.trim(),
        coverImage: body.coverImage?.trim() || null,
        bodyFr: body.bodyFr.trim(),
        bodyAr: body.bodyAr.trim(),
        isPublished: body.isPublished ?? true,
        publishedAt: body.isPublished === false ? null : new Date(),
      },
    });

    return NextResponse.json({ story }, { status: 201 });
  } catch (e) {
    console.error("[api/admin/stories POST]", e);
    return databaseUnavailableResponse();
  }
}
