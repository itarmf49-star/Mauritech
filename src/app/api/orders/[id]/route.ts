import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: { include: { product: true } } },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (e) {
    console.error("[api/orders/[id] GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { status, paymentStatus, notes } = body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (notes !== undefined) data.notes = notes?.trim() || null;

    const order = await prisma.order.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ order });
  } catch (e) {
    console.error("[api/orders/[id] PUT]", e);
    return databaseUnavailableResponse();
  }
}
