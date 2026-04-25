import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  try {
    const [pageViews, aiUsage7d, chatMessages7d, customers] = await Promise.all([
      prisma.pageView.findMany({
        where: { createdAt: { gte: since } },
        select: { path: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 8000,
      }),
      prisma.aiUsage.count({ where: { createdAt: { gte: since } } }),
      prisma.chatMessage.count({ where: { createdAt: { gte: since } } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

    return NextResponse.json({
      customers,
      pageViews,
      aiUsage7d,
      chatMessages7d,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
