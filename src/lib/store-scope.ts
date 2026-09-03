import { prisma } from "@/lib/prisma";

/**
 * نطاق وصول المستخدم للمتاجر ضمن لوحة الأدمن.
 * - السوبر أدمن (role=ADMIN) يرى/يدير كل المتاجر.
 * - مدير متجر (StoreUser) يرى فقط المتاجر المسندة إليه عبر جدول store_users.
 */
export type StoreScope = { isSuperAdmin: boolean; storeIds: string[] };

export async function getStoreScope(userId: number | string, role: string | undefined): Promise<StoreScope> {
  if (role === "ADMIN") {
    return { isSuperAdmin: true, storeIds: [] };
  }
  const numericId = typeof userId === "string" ? Number(userId) : userId;
  if (!Number.isFinite(numericId)) {
    return { isSuperAdmin: false, storeIds: [] };
  }
  const rows = await prisma.storeUser.findMany({
    where: { userId: numericId as number },
    select: { storeId: true },
  });
  return { isSuperAdmin: false, storeIds: rows.map((r) => r.storeId) };
}

/** true إذا يحق للمستخدم الوصول لهذا المتجر تحديداً. */
export function canAccessStore(scope: StoreScope, storeId: string) {
  if (scope.isSuperAdmin) return true;
  return scope.storeIds.includes(storeId);
}

/** فلتر Prisma where.storeId جاهز — undefined يعني بلا قيد (سوبر أدمن). */
export function storeWhereFilter(scope: StoreScope, requestedStoreId?: string | null) {
  if (scope.isSuperAdmin) {
    return requestedStoreId ? { storeId: requestedStoreId } : {};
  }
  if (requestedStoreId && scope.storeIds.includes(requestedStoreId)) {
    return { storeId: requestedStoreId };
  }
  return { storeId: { in: scope.storeIds.length ? scope.storeIds : ["__none__"] } };
}

/** يحدد المتجر المستهدف عند الإنشاء (منتج/طلب جديد...). */
export async function resolveTargetStoreId(scope: StoreScope, requestedStoreId?: string | null) {
  if (scope.isSuperAdmin) {
    if (requestedStoreId) return requestedStoreId;
    const first = await prisma.store.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } });
    return first?.id ?? null;
  }
  if (requestedStoreId && scope.storeIds.includes(requestedStoreId)) return requestedStoreId;
  return scope.storeIds[0] ?? null;
}
