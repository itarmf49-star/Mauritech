import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const GUEST_CART_COOKIE = "mauritech_guest_cart";

/**
 * معرّف سلة فريد لكل زائر غير مسجّل (كوكيز)، بدل استخدام سلسلة ثابتة واحدة
 * "guest" كانت تجعل كل الزوار غير المسجلين يتشاركون نفس السلة عبر الموقع بأكمله.
 */
export async function getGuestCartId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(GUEST_CART_COOKIE)?.value;
  if (existing) return existing;

  const id = `guest-${randomUUID()}`;
  store.set(GUEST_CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 يوماً
  });
  return id;
}
