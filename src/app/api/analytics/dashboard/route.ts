import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const staff = await getStaffSession();
    if (!staff.ok) return staff.response;

    const [totalOrders, revenue, productsCount, customersCount, recentOrders, salesByDay] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.customer.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { items: { include: { product: true } } } }),
      prisma.sale.groupBy({
        by: ["createdAt"],
        _sum: { total: true },
        orderBy: { createdAt: "desc" },
        take: 14,
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      revenue: revenue._sum.total || 0,
      productsCount,
      customersCount,
      recentOrders,
      salesByDay,
    });
  } catch (e) {
    console.error("[api/analytics/dashboard GET]", e);
    return databaseUnavailableResponse();
  }
}
