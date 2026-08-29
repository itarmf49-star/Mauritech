import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getStaffSession } from "@/lib/staff-api";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const staff = await getStaffSession();
    const isAdmin = staff.ok;

    const session = await getServerSession(authOptions);
    const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
    const userId = rawUid ? (typeof rawUid === "string" ? Number(rawUid) : (rawUid as number)) : undefined;
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (!isAdmin && userId) where.userId = userId;
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ orders });
  } catch (e) {
    console.error("[api/orders GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
    const userId = rawUid ? (typeof rawUid === "string" ? Number(rawUid) : (rawUid as number)) : undefined;

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { customerName, customerEmail, customerPhone, shippingAddress, billingAddress, items, notes, paymentMethod } = body;

    if (!isNonEmptyString(customerName)) return NextResponse.json({ error: "customerName is required" }, { status: 400 });
    if (!isNonEmptyString(customerEmail)) return NextResponse.json({ error: "customerEmail is required" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "items are required" }, { status: 400 });

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone?.trim() || null,
        shippingAddress: shippingAddress ?? null,
        billingAddress: billingAddress ?? null,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        paymentStatus: "PENDING",
        status: "PENDING",
        notes: notes?.trim() || null,
        paymentMethod: paymentMethod?.trim() || null,
        source: "web",
        items: {
          create: items.map((item: { productId: string; quantity: number; unitPrice?: number }) => ({
            productId: item.productId,
            productName: "",
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            total: (item.unitPrice || 0) * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (e) {
    console.error("[api/orders POST]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
