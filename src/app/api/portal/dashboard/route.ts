import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = typeof userId === "string" ? Number(userId) : (userId as number);

  try {
    const account = await prisma.clientAccount.findFirst({
      where: { userId: uid },
      select: { id: true, company: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const accountWhere = account ? { accountId: account.id } : { account: { userId: uid } };

    const [totalInvoices, paidInvoices, pendingInvoices, recentInvoices, lastMessage, recentProjects, openTickets, documentsCount, savedPlansCount, recentRequests] = await Promise.all([
      prisma.invoice.count({ where: accountWhere }),
      prisma.invoice.count({ where: { ...accountWhere, status: "paid" } }),
      prisma.invoice.count({ where: { ...accountWhere, NOT: { status: "paid" } } }),
      prisma.invoice.findMany({
        where: accountWhere,
        take: 5,
        orderBy: { issuedAt: "desc" },
        include: {
          items: true,
          account: true,
        },
      }),
      prisma.message.findFirst({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
      }),
      prisma.portalProject.findMany({
        where: { userId: uid },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, status: true, progress: true },
      }),
      prisma.supportTicket.count({ where: { userId: uid, status: { not: "closed" } } }),
      prisma.portalDocument.count({ where: { userId: uid } }),
      prisma.coveragePlan.count({ where: { userId: uid } }),
      prisma.serviceRequest.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, type: true, status: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      totalInvoices,
      pendingInvoices,
      paidInvoices,
      recentInvoices,
      lastMessage,
      recentProjects,
      openTickets,
      documentsCount,
      savedPlansCount,
      recentRequests,
    });
  } catch (e) {
    console.error("[api/portal/dashboard GET]", e);
    return databaseUnavailableResponse();
  }
}
