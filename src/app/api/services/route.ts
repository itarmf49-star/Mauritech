import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** قائمة عامة بالخدمات النشطة — لصفحة /services ولوحة العرض في الصفحة الرئيسية. */
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(
      { services },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
    );
  } catch (e) {
    console.error("[api/services GET]", e);
    return databaseUnavailableResponse();
  }
}
