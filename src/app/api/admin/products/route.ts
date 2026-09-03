import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, resolveTargetStoreId, storeWhereFilter } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const categoryId = url.searchParams.get("categoryId") || "";
    const status = url.searchParams.get("status") || "";
    const storeIdParam = url.searchParams.get("storeId") || "";

    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    const where: any = { ...storeWhereFilter(scope, storeIdParam) };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;
    if (status === "featured") where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        inventory: true,
      },
    });

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
    });

    const stores = scope.isSuperAdmin
      ? await prisma.store.findMany({ select: { id: true, nameFr: true, nameAr: true }, orderBy: { nameFr: "asc" } })
      : await prisma.store.findMany({ where: { id: { in: scope.storeIds } }, select: { id: true, nameFr: true, nameAr: true } });

    return NextResponse.json({ products, categories, stores });
  } catch (e) {
    console.error("[api/admin/products GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json();
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    const storeId = await resolveTargetStoreId(scope, body.storeId);
    if (!storeId) {
      return NextResponse.json({ error: "لا يوجد متجر متاح — أنشئ متجراً أولاً" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        storeId,
        name: body.name,
        nameAr: body.nameAr || undefined,
        slug: body.slug,
        description: body.description || "",
        descriptionAr: body.descriptionAr || undefined,
        price: Number(body.price) || 0,
        comparePrice: body.comparePrice ? Number(body.comparePrice) : undefined,
        cost: body.cost ? Number(body.cost) : undefined,
        sku: body.sku || undefined,
        barcode: body.barcode || undefined,
        images: body.images || [],
        categoryId: body.categoryId || undefined,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        weight: body.weight ? Number(body.weight) : undefined,
        dimensions: body.dimensions || undefined,
        tags: body.tags || [],
      },
    });

    if (body.trackQuantity !== false) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          quantity: Number(body.quantity) || 0,
          reservedQty: 0,
          lowStockThreshold: Number(body.lowStockThreshold) || 5,
          trackQuantity: body.trackQuantity ?? true,
          allowBackorder: body.allowBackorder ?? false,
        },
      });
    }

    return NextResponse.json({ product });
  } catch (e) {
    console.error("[api/admin/products POST]", e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
