import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope, canAccessStore } from "@/lib/store-scope";

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

const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, notes, paymentStatus, paymentReference } = body;

    if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid paymentStatus" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!canAccessStore(scope, order.storeId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (paymentReference !== undefined) data.paymentIntentId = paymentReference?.trim() || null;

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
