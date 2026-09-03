import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";
import { getGuestCartId } from "@/lib/guest-cart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function resolveCartOwner() {
  const session = await getServerSession(authOptions);
  const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
  const userId = rawUid ? (typeof rawUid === "string" ? Number(rawUid) : (rawUid as number)) : undefined;
  const guestId = userId ? null : await getGuestCartId();
  return { userId, guestId };
}

export async function GET() {
  try {
    const { userId, guestId } = await resolveCartOwner();

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId: guestId },
      include: {
        items: {
          include: {
            product: {
              include: {
                offerProducts: {
                  where: { offer: { isActive: true } },
                  include: { offer: { select: { discountType: true, discountValue: true, titleFr: true, titleAr: true } } },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ cart: cart ?? null, items: cart?.items ?? [] });
  } catch (e) {
    console.error("[api/cart GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  try {
    const { userId, guestId } = await resolveCartOwner();

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { productId, quantity } = body;
    if (!isNonEmptyString(productId)) return NextResponse.json({ error: "productId is required" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId: guestId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId: userId ? null : guestId,
        },
      });
    }

    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: Number(quantity) || 1 } },
      create: {
        cartId: cart.id,
        productId,
        quantity: Number(quantity) || 1,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    console.error("[api/cart POST]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, guestId } = await resolveCartOwner();

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { productId } = body;
    const quantity = Number(body.quantity);
    if (!isNonEmptyString(productId)) return NextResponse.json({ error: "productId is required" }, { status: 400 });
    if (!Number.isFinite(quantity) || quantity < 1) return NextResponse.json({ error: "quantity must be a positive number" }, { status: 400 });

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId: guestId },
    });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("[api/cart PATCH]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, guestId } = await resolveCartOwner();

    const url = new URL(req.url);
    let productId = url.searchParams.get("productId");
    if (!productId) {
      const body = await req.json().catch(() => null);
      productId = body?.productId ?? null;
    }
    if (!isNonEmptyString(productId)) return NextResponse.json({ error: "productId is required" }, { status: 400 });

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId: guestId },
      include: { items: true },
    });

    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/cart DELETE]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
