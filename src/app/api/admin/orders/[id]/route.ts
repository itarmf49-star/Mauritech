import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const allowed = ALLOWED_TRANSITIONS[order.status] || [];
    if (status && !allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${status}` },
        { status: 400 }
      );
    }

    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const updated = await prisma.order.update({
      where: { id },
      data,
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
    });

    return NextResponse.json({ order: updated });
  } catch (e) {
    console.error("[api/admin/orders/[id] PATCH]", e);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
