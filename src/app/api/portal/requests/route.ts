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
  const uid = typeof userId === "string" ? Number(userId) : (userId as number);

  try {
    const requests = await prisma.serviceRequest.findMany({
      where: { userId: String(uid) },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        status: true,
        name: true,
        notes: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ requests });
  } catch (e) {
    console.error("[api/portal/requests GET]", e);
    return databaseUnavailableResponse();
  }
}
