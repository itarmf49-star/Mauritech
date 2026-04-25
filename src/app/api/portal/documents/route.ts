import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    let docs = await prisma.portalDocument.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    if (docs.length === 0) {
      await prisma.portalDocument.createMany({
        data: [
          {
            userId,
            title: "Project Scope and Timeline",
            fileType: "PDF",
            url: "/api/portal/invoices",
            sizeBytes: 1240000,
          },
          {
            userId,
            title: "Infrastructure Handover Checklist",
            fileType: "PDF",
            url: "/api/portal/messages",
            sizeBytes: 842000,
          },
        ],
      });
      docs = await prisma.portalDocument.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }
    return NextResponse.json({ documents: docs });
  } catch (e) {
    console.error("[api/portal/documents GET]", e);
    return databaseUnavailableResponse();
  }
}
