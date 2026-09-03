import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, canAccessStore } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!canAccessStore(scope, product.storeId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ product });
  } catch (e) {
    console.error("[api/admin/products/[id] GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({ where: { id }, select: { storeId: true } });
    if (!existingProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!canAccessStore(scope, existingProduct.storeId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.nameAr !== undefined) data.nameAr = body.nameAr || null;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description;
    if (body.descriptionAr !== undefined) data.descriptionAr = body.descriptionAr || null;
    // نقل منتج بين المتاجر مسموح فقط للسوبر أدمن، وللمتجر الهدف الذي يملك صلاحية عليه
    if (body.storeId !== undefined && scope.isSuperAdmin && canAccessStore(scope, body.storeId)) {
      data.storeId = body.storeId;
    }
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.comparePrice !== undefined) data.comparePrice = Number(body.comparePrice);
    if (body.cost !== undefined) data.cost = Number(body.cost);
    if (body.sku !== undefined) data.sku = body.sku;
    if (body.barcode !== undefined) data.barcode = body.barcode;
    if (body.images !== undefined) data.images = body.images;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.weight !== undefined) data.weight = Number(body.weight);
    if (body.dimensions !== undefined) data.dimensions = body.dimensions;
    if (body.tags !== undefined) data.tags = body.tags;

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    if (body.inventory) {
      const existing = await prisma.inventory.findUnique({
        where: { productId: id },
      });

      if (existing) {
        await prisma.inventory.update({
          where: { productId: id },
          data: {
            quantity: Number(body.inventory.quantity) ?? existing.quantity,
            lowStockThreshold: Number(body.inventory.lowStockThreshold) ?? existing.lowStockThreshold,
            trackQuantity: body.inventory.trackQuantity ?? existing.trackQuantity,
            allowBackorder: body.inventory.allowBackorder ?? existing.allowBackorder,
          },
        });
      } else {
        await prisma.inventory.create({
          data: {
            productId: id,
            quantity: Number(body.inventory.quantity) || 0,
            lowStockThreshold: Number(body.inventory.lowStockThreshold) || 5,
            trackQuantity: body.inventory.trackQuantity ?? true,
            allowBackorder: body.inventory.allowBackorder ?? false,
          },
        });
      }
    }

    return NextResponse.json({ product });
  } catch (e) {
    console.error("[api/admin/products/[id] PATCH]", e);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({ where: { id }, select: { storeId: true } });
    if (!existingProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!canAccessStore(scope, existingProduct.storeId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.inventory.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/admin/products/[id] DELETE]", e);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
