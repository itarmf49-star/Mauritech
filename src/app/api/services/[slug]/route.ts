import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** تفاصيل خدمة واحدة عامة — لصفحة /services/[slug]. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const service = await prisma.service.findUnique({ where: { slug, isActive: true } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    return NextResponse.json(
      { service },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
    );
  } catch (e) {
    console.error("[api/services/[slug] GET]", e);
    return databaseUnavailableResponse();
  }
}
