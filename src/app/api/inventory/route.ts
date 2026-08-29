import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { product: { select: { id: true, name: true, slug: true, isActive: true } } },
      orderBy: { quantity: "asc" },
    });

    return NextResponse.json({ inventory });
  } catch (e) {
    console.error("[api/inventory GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PUT(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { productId, quantity, reservedQty, lowStockThreshold, allowBackorder, trackQuantity } = body;

    if (!isNonEmptyString(productId)) return NextResponse.json({ error: "productId is required" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (typeof quantity === "number") data.quantity = quantity;
    if (typeof reservedQty === "number") data.reservedQty = reservedQty;
    if (typeof lowStockThreshold === "number") data.lowStockThreshold = lowStockThreshold;
    if (typeof allowBackorder === "boolean") data.allowBackorder = allowBackorder;
    if (typeof trackQuantity === "boolean") data.trackQuantity = trackQuantity;

    const inventory = await prisma.inventory.update({
      where: { productId },
      data,
    });

    return NextResponse.json({ inventory });
  } catch (e) {
    console.error("[api/inventory PUT]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
