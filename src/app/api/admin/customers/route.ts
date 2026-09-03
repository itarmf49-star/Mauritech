import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);

    // مدير متجر (غير سوبر أدمن) لا يرى إلا الزبائن الذين طلبوا فعلاً من متجره/متاجره —
    // وليس قائمة عملاء المنصة كاملة، حفاظاً على خصوصية بيانات المتاجر الأخرى.
    const storeFilter = scope.isSuperAdmin ? undefined : { in: scope.storeIds.length ? scope.storeIds : ["__none__"] };

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        ...(storeFilter ? { orders: { some: { storeId: storeFilter } } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        info: true,
        createdAt: true,
        orders: {
          where: storeFilter ? { storeId: storeFilter } : undefined,
          select: { total: true },
        },
      },
    });

    return NextResponse.json({ customers });
  } catch (e) {
    console.error("[api/admin/customers GET]", e);
    return databaseUnavailableResponse();
  }
}
