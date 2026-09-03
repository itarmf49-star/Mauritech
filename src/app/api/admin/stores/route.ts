import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope } from "@/lib/store-scope";
import slugify from "slugify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);

    const stores = await prisma.store.findMany({
      where: scope.isSuperAdmin ? {} : { id: { in: scope.storeIds.length ? scope.storeIds : ["__none__"] } },
      include: {
        _count: { select: { products: true, orders: true } },
        storeUsers: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ stores, isSuperAdmin: scope.isSuperAdmin });
  } catch (e) {
    console.error("[api/admin/stores GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!scope.isSuperAdmin) {
      return NextResponse.json({ error: "لا تملك صلاحية إنشاء متاجر" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { nameFr, nameAr, descriptionFr, descriptionAr, logoUrl, bannerUrl, currency } = body;
    if (!isNonEmptyString(nameFr)) return NextResponse.json({ error: "nameFr is required" }, { status: 400 });
    if (!isNonEmptyString(nameAr)) return NextResponse.json({ error: "nameAr is required" }, { status: 400 });

    let baseSlug = slugify(body.slug?.trim() || nameFr, { lower: true, strict: true });
    if (!baseSlug) baseSlug = `store-${Date.now()}`;
    let slug = baseSlug;
    let n = 1;
    while (await prisma.store.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${baseSlug}-${++n}`;
    }

    const store = await prisma.store.create({
      data: {
        slug,
        nameFr: nameFr.trim(),
        nameAr: nameAr.trim(),
        descriptionFr: descriptionFr?.trim() || null,
        descriptionAr: descriptionAr?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        bannerUrl: bannerUrl?.trim() || null,
        currency: currency?.trim() || "MRU",
      },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (e) {
    console.error("[api/admin/stores POST]", e);
    return databaseUnavailableResponse();
  }
}
