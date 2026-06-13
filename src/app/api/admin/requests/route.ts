import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  try {
    const requests = await prisma.serviceRequest.findMany({
      where: type ? { type: type as "SITE_SURVEY" | "INSTALLATION" | "CONSULTATION" } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ requests });
  } catch (e) {
    console.error("[api/admin/requests GET]", e);
    return databaseUnavailableResponse();
  }
}
