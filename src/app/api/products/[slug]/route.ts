import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        inventory: true,
        reviews: { where: { isApproved: true }, include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      },
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    console.error("[api/products/[slug] GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { name, description, price, comparePrice, cost, images, categoryId, sku, barcode, weight, dimensions, isActive, isFeatured, metaTitle, metaDesc, tags } = body;

    const data: Record<string, unknown> = {};
    if (isNonEmptyString(name)) data.name = name.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (price !== undefined) data.price = Number(price);
    if (comparePrice !== undefined) data.comparePrice = comparePrice ? Number(comparePrice) : null;
    if (cost !== undefined) data.cost = cost ? Number(cost) : null;
    if (images !== undefined) data.images = images;
    if (categoryId !== undefined) data.categoryId = categoryId?.trim() || null;
    if (sku !== undefined) data.sku = sku?.trim() || null;
    if (barcode !== undefined) data.barcode = barcode?.trim() || null;
    if (weight !== undefined) data.weight = weight ? Number(weight) : null;
    if (dimensions !== undefined) data.dimensions = dimensions;
    if (typeof isActive === "boolean") data.isActive = isActive;
    if (typeof isFeatured === "boolean") data.isFeatured = isFeatured;
    if (metaTitle !== undefined) data.metaTitle = metaTitle?.trim() || null;
    if (metaDesc !== undefined) data.metaDesc = metaDesc?.trim() || null;
    if (Array.isArray(tags)) data.tags = tags;

    const product = await prisma.product.update({
      where: { slug: params.slug },
      data,
      include: { category: { select: { id: true, name: true, slug: true } }, inventory: true },
    });

    return NextResponse.json({ product });
  } catch (e) {
    console.error("[api/products/[slug] PUT]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    await prisma.product.delete({ where: { slug: params.slug } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/products/[slug] DELETE]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
