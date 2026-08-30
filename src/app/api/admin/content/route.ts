import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "MauriTech",
        },
      });
    }

    return NextResponse.json({
      heroTitleFr: settings.heroTitleFr || "",
      heroTitleAr: settings.heroTitleAr || "",
      heroSubtitleFr: settings.heroSubtitleFr || "",
      heroSubtitleAr: settings.heroSubtitleAr || "",
      bannerTextFr: settings.bannerTextFr || "",
      bannerTextAr: settings.bannerTextAr || "",
      bannerVisible: settings.bannerVisible || false,
      ctaButtonFr: settings.ctaButtonFr || "",
      ctaButtonAr: settings.ctaButtonAr || "",
      ctaLink: settings.ctaLink || "",
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    let settings = await prisma.siteSettings.findFirst();
    
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          heroTitleFr: body.heroTitleFr,
          heroTitleAr: body.heroTitleAr,
          heroSubtitleFr: body.heroSubtitleFr,
          heroSubtitleAr: body.heroSubtitleAr,
          bannerTextFr: body.bannerTextFr,
          bannerTextAr: body.bannerTextAr,
          bannerVisible: body.bannerVisible,
          ctaButtonFr: body.ctaButtonFr,
          ctaButtonAr: body.ctaButtonAr,
          ctaLink: body.ctaLink,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "MauriTech",
          heroTitleFr: body.heroTitleFr,
          heroTitleAr: body.heroTitleAr,
          heroSubtitleFr: body.heroSubtitleFr,
          heroSubtitleAr: body.heroSubtitleAr,
          bannerTextFr: body.bannerTextFr,
          bannerTextAr: body.bannerTextAr,
          bannerVisible: body.bannerVisible,
          ctaButtonFr: body.ctaButtonFr,
          ctaButtonAr: body.ctaButtonAr,
          ctaLink: body.ctaLink,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}