import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";
import { computeDiscountedPrice } from "@/lib/pricing";
import { getGuestCartId } from "@/lib/guest-cart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
    const userId = rawUid ? (typeof rawUid === "string" ? Number(rawUid) : (rawUid as number)) : undefined;
    const guestId = userId ? null : await getGuestCartId();

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { name, email, phone, address, notes, paymentMethod } = body;
    if (!isNonEmptyString(name)) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    if (!isNonEmptyString(email)) return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    if (!isNonEmptyString(phone)) return NextResponse.json({ error: "الهاتف مطلوب" }, { status: 400 });
    if (!isNonEmptyString(address)) return NextResponse.json({ error: "عنوان التوصيل مطلوب" }, { status: 400 });

    const shippingAddress = { street: address.trim() };
    const billingAddress = shippingAddress;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId: guestId },
      include: {
        items: {
          include: {
            product: {
              include: {
                inventory: true,
                offerProducts: {
                  where: { offer: { isActive: true } },
                  include: { offer: { select: { discountType: true, discountValue: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });

    const customerName = name.trim();
    const customerEmail = email.trim();
    const customerPhone = phone.trim();
    const allowedPaymentMethods = ["COD", "BANKILY", "MASRVI", "SEDAD", "CARD"];
    const resolvedPaymentMethod = allowedPaymentMethods.includes(paymentMethod) ? paymentMethod : "COD";

    // سلة السوق قد تحتوي منتجات من عدة متاجر — كل متجر يُنشأ له طلب مستقل (سلوك Amazon Marketplace).
    const itemsByStore = new Map<string, typeof cart.items>();
    for (const item of cart.items) {
      const list = itemsByStore.get(item.product.storeId) ?? [];
      list.push(item);
      itemsByStore.set(item.product.storeId, list);
    }

    const orders = [];
    for (const [storeId, items] of itemsByStore) {
      const priced = items.map((item) => {
        const { finalPrice } = computeDiscountedPrice(item.product.price, item.product.offerProducts);
        return { item, unitPrice: finalPrice };
      });
      const subtotal = priced.reduce((sum, { item, unitPrice }) => sum + unitPrice * item.quantity, 0);
      const discount = priced.reduce((sum, { item, unitPrice }) => sum + (item.product.price - unitPrice) * item.quantity, 0);
      const shipping = 0;
      const tax = 0;
      const total = subtotal + shipping + tax;
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          storeId,
          userId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          billingAddress,
          subtotal,
          tax,
          shipping,
          discount,
          total,
          // يبدأ كل طلب بحالة "قيد الانتظار" حتى تؤكّد الإدارة الدفع فعلياً (يدوياً للدفع عند
          // الاستلام، أو عبر بوابة الدفع لاحقاً للوسائل الإلكترونية).
          paymentStatus: "PENDING",
          status: "PENDING",
          notes: notes?.trim() || null,
          paymentMethod: resolvedPaymentMethod,
          source: "web",
          items: {
            create: priced.map(({ item, unitPrice }) => ({
              productId: item.product.id,
              productName: item.product.name,
              productSku: item.product.sku ?? null,
              quantity: item.quantity,
              unitPrice,
              total: unitPrice * item.quantity,
            })),
          },
        },
        include: { items: true },
      });
      orders.push(order);
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ orders, order: orders[0] }, { status: 201 });
  } catch (e) {
    console.error("[api/cart/checkout POST]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
