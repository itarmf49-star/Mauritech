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
    let rows = await prisma.portalProject.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    if (rows.length === 0) {
      await prisma.portalProject.createMany({
        data: [
          {
            userId,
            title: "Enterprise IPBX and Office VoIP Deployment",
            summary: "Telephony platform rollout with SIP and centralized administration.",
            status: "in-progress",
            progress: 82,
          },
          {
            userId,
            title: "Enterprise CCTV and Smart Surveillance Deployment",
            summary: "Security monitoring modernization with remote operations access.",
            status: "active",
            progress: 64,
          },
        ],
      });
      rows = await prisma.portalProject.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ projects: rows });
  } catch (e) {
    console.error("[api/portal/projects GET]", e);
    return databaseUnavailableResponse();
  }
}
