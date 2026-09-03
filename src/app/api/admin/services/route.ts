import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ services });
  } catch (e) {
    console.error("[api/admin/services GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    if (!isNonEmptyString(body.titleFr) || !isNonEmptyString(body.titleAr)) {
      return NextResponse.json({ error: "العنوان مطلوب بالفرنسية والعربية" }, { status: 400 });
    }
    if (!isNonEmptyString(body.slug)) {
      return NextResponse.json({ error: "الرابط (slug) مطلوب" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        slug: body.slug.trim(),
        titleFr: body.titleFr.trim(),
        titleAr: body.titleAr.trim(),
        descriptionFr: body.descriptionFr?.trim() || null,
        descriptionAr: body.descriptionAr?.trim() || null,
        icon: body.icon?.trim() || null,
        image: body.image?.trim() || null,
        videos: Array.isArray(body.videos) ? body.videos : [],
        featuresFr: Array.isArray(body.featuresFr) ? body.featuresFr : [],
        featuresAr: Array.isArray(body.featuresAr) ? body.featuresAr : [],
        order: Number.isFinite(body.order) ? Number(body.order) : 0,
        isActive: typeof body.isActive === "boolean" ? body.isActive : true,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "هذا الرابط (slug) مستخدم بالفعل" }, { status: 409 });
    }
    console.error("[api/admin/services POST]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
