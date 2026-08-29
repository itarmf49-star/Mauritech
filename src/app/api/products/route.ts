import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get("categoryId");
    const featured = url.searchParams.get("featured");

    const where: Record<string, unknown> = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (featured === "true") where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        inventory: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ products });
  } catch (e) {
    console.error("[api/products GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { name, slug, description, price, comparePrice, cost, images, categoryId, sku, barcode, weight, dimensions, isActive, isFeatured, metaTitle, metaDesc, tags } = body;

    if (!isNonEmptyString(name)) return NextResponse.json({ error: "name is required" }, { status: 400 });
    if (!isNonEmptyString(slug)) return NextResponse.json({ error: "slug is required" }, { status: 400 });

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        price: Number(price) || 0,
        comparePrice: comparePrice ? Number(comparePrice) : null,
        cost: cost ? Number(cost) : null,
        images: images ?? null,
        categoryId: categoryId?.trim() || null,
        sku: sku?.trim() || null,
        barcode: barcode?.trim() || null,
        weight: weight ? Number(weight) : null,
        dimensions: dimensions ?? null,
        isActive: typeof isActive === "boolean" ? isActive : true,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
        metaTitle: metaTitle?.trim() || null,
        metaDesc: metaDesc?.trim() || null,
        tags: Array.isArray(tags) ? tags : [],
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        inventory: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    console.error("[api/products POST]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
