import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** إعدادات عامة للموقع (الاسم والشعار) — بلا حماية، تُستخدم في الهيدر والفوتر العام. */
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      select: { siteName: true, logoUrl: true, logoDarkUrl: true, faviconUrl: true },
    });
    return NextResponse.json(
      {
        siteName: settings?.siteName || "MauriTech",
        logoUrl: settings?.logoUrl || null,
        logoDarkUrl: settings?.logoDarkUrl || null,
        faviconUrl: settings?.faviconUrl || null,
      },
      { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } },
    );
  } catch (e) {
    console.error("[api/site-settings GET]", e);
    return NextResponse.json({ siteName: "MauriTech", logoUrl: null, logoDarkUrl: null, faviconUrl: null });
  }
}
