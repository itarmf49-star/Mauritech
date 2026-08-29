import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
    const userId = rawUid ? (typeof rawUid === "string" ? Number(rawUid) : (rawUid as number)) : undefined;

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { shippingAddress, billingAddress, notes, paymentMethod } = body;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId: "guest" },
      include: { items: { include: { product: { include: { inventory: true } } } } },
    });

    if (!cart || cart.items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 0 : 0;
    const tax = Math.round(subtotal * 0);
    const discount = 0;
    const total = subtotal + shipping + tax - discount;

    const customerName = (session as { user?: { name?: string } } | null)?.user?.name || "Guest";
    const customerEmail = (session as { user?: { email?: string } } | null)?.user?.email || "guest@example.com";

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerName,
        customerEmail,
        shippingAddress: shippingAddress ?? null,
        billingAddress: billingAddress ?? null,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        paymentStatus: "PENDING",
        status: "PENDING",
        notes: notes?.trim() || null,
        paymentMethod: paymentMethod?.trim() || null,
        source: "web",
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productSku: item.product.sku ?? null,
            quantity: item.quantity,
            unitPrice: item.product.price,
            total: item.product.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (e) {
    console.error("[api/cart/checkout POST]", e);
    return databaseUnavailableResponse();
  }
}
