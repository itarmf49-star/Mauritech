import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";

    const where: any = {};
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
          },
        },
      },
    });

    const statusCounts = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
      _sum: { total: true },
    });

    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    });

    return NextResponse.json({ orders, statusCounts, totalRevenue: totalRevenue._sum.total || 0 });
  } catch (e) {
    console.error("[api/admin/orders GET]", e);
    return databaseUnavailableResponse();
  }
}
