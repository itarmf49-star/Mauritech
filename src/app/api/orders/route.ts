import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getStaffSession } from "@/lib/staff-api";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";
import { getStoreScope, storeWhereFilter } from "@/lib/store-scope";

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
    const storeIdParam = url.searchParams.get("storeId");

    // زائر مجهول الهوية (بدون تسجيل دخول ولا صلاحية موظف) لا يحق له رؤية أي طلبات إطلاقاً.
    if (!isAdmin && !userId) {
      return NextResponse.json({ orders: [] });
    }

    let where: Record<string, unknown> = {};
    if (isAdmin) {
      const scope = await getStoreScope(staff.session!.user.id, staff.session!.user.role);
      where = { ...storeWhereFilter(scope, storeIdParam) };
    } else if (userId) {
      where.userId = userId;
    }
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

    const productIds = (items as { productId: string }[]).map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true, price: true, storeId: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const storeIds = new Set(products.map((p) => p.storeId));
    if (storeIds.size === 0) return NextResponse.json({ error: "Products not found" }, { status: 400 });
    if (storeIds.size > 1) {
      return NextResponse.json({ error: "لا يمكن إنشاء طلب واحد لمنتجات من متاجر مختلفة — استخدم /api/cart/checkout" }, { status: 400 });
    }
    const storeId = [...storeIds][0];

    const orderItems = (items as { productId: string; quantity: number; unitPrice?: number }[]).map((item) => {
      const product = productMap.get(item.productId);
      const unitPrice = item.unitPrice ?? product?.price ?? 0;
      return {
        productId: item.productId,
        productName: product?.name ?? "",
        productSku: product?.sku ?? null,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
      };
    });
    const subtotal = orderItems.reduce((sum, it) => sum + it.total, 0);

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        storeId,
        userId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone?.trim() || null,
        shippingAddress: shippingAddress ?? null,
        billingAddress: billingAddress ?? null,
        subtotal,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: subtotal,
        paymentStatus: "PENDING",
        status: "PENDING",
        notes: notes?.trim() || null,
        paymentMethod: paymentMethod?.trim() || null,
        source: "web",
        items: { create: orderItems },
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
