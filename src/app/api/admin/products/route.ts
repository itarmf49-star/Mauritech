import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

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

    const where: any = {};
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

    return NextResponse.json({ products, categories });
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
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || "",
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
