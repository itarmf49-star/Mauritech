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

    const inventory = await prisma.inventory.findMany({
      where: {
        product: {
          ...(search ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          } : {}),
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
      include: {
        product: {
          select: { id: true, name: true, slug: true, sku: true, price: true, images: true, isActive: true },
        },
      },
    });

    const stats = {
      total: inventory.length,
      inStock: inventory.filter((i) => i.quantity > i.lowStockThreshold).length,
      lowStock: inventory.filter((i) => i.quantity > 0 && i.quantity <= i.lowStockThreshold).length,
      outOfStock: inventory.filter((i) => i.quantity <= 0).length,
    };

    return NextResponse.json({ inventory, stats });
  } catch (e) {
    console.error("[api/admin/inventory GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json();
    const { productId, quantity, lowStockThreshold } = body;

    const data: any = {};
    if (quantity !== undefined) data.quantity = Number(quantity);
    if (lowStockThreshold !== undefined) data.lowStockThreshold = Number(lowStockThreshold);

    const updated = await prisma.inventory.update({
      where: { productId },
      data,
      include: { product: true },
    });

    return NextResponse.json({ inventory: updated });
  } catch (e) {
    console.error("[api/admin/inventory PATCH]", e);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
