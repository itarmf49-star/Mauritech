import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const settings = await prisma.designSettings.findFirst();
    return NextResponse.json({
      settings: settings || {
        primaryColor: "#F5C542",
        cardRadius: 16,
        glassOpacity: 0.15,
        fontFamily: "Cairo",
        isMaintenanceMode: false,
      },
    });
  } catch (e) {
    console.error("[api/admin/design-settings GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const data = {
      primaryColor: typeof body.primaryColor === "string" ? body.primaryColor : undefined,
      cardRadius: Number.isFinite(body.cardRadius) ? Number(body.cardRadius) : undefined,
      glassOpacity: Number.isFinite(body.glassOpacity) ? Number(body.glassOpacity) : undefined,
      fontFamily: typeof body.fontFamily === "string" ? body.fontFamily : undefined,
      isMaintenanceMode: typeof body.isMaintenanceMode === "boolean" ? body.isMaintenanceMode : undefined,
    };

    const existing = await prisma.designSettings.findFirst();
    const settings = existing
      ? await prisma.designSettings.update({ where: { id: existing.id }, data })
      : await prisma.designSettings.create({
          data: {
            primaryColor: data.primaryColor ?? "#F5C542",
            cardRadius: data.cardRadius ?? 16,
            glassOpacity: data.glassOpacity ?? 0.15,
            fontFamily: data.fontFamily ?? "Cairo",
            isMaintenanceMode: data.isMaintenanceMode ?? false,
          },
        });

    return NextResponse.json({ settings });
  } catch (e) {
    console.error("[api/admin/design-settings PATCH]", e);
    return databaseUnavailableResponse();
  }
}
