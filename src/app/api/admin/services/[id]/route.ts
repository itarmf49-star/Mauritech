import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const data: any = {};
    if (body.slug !== undefined) data.slug = String(body.slug).trim();
    if (body.titleFr !== undefined) data.titleFr = String(body.titleFr).trim();
    if (body.titleAr !== undefined) data.titleAr = String(body.titleAr).trim();
    if (body.descriptionFr !== undefined) data.descriptionFr = body.descriptionFr?.trim() || null;
    if (body.descriptionAr !== undefined) data.descriptionAr = body.descriptionAr?.trim() || null;
    if (body.icon !== undefined) data.icon = body.icon?.trim() || null;
    if (body.image !== undefined) data.image = body.image?.trim() || null;
    if (body.videos !== undefined) data.videos = Array.isArray(body.videos) ? body.videos : [];
    if (body.featuresFr !== undefined) data.featuresFr = Array.isArray(body.featuresFr) ? body.featuresFr : [];
    if (body.featuresAr !== undefined) data.featuresAr = Array.isArray(body.featuresAr) ? body.featuresAr : [];
    if (body.order !== undefined) data.order = Number(body.order) || 0;
    if (body.isActive !== undefined) data.isActive = !!body.isActive;

    const service = await prisma.service.update({ where: { id }, data });
    return NextResponse.json({ service });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "هذا الرابط (slug) مستخدم بالفعل" }, { status: 409 });
    }
    console.error("[api/admin/services/[id] PATCH]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/services/[id] DELETE]", e);
    return databaseUnavailableResponse();
  }
}
