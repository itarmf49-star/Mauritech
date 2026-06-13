import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  manufacturer: z.string().trim().min(1).max(120).optional(),
  deviceType: z.enum(["ROUTER", "ACCESS_POINT", "MESH_NODE"]).optional(),
  price: z.number().int().nonnegative().max(100_000_000).optional(),
  coverageRadiusM: z.number().positive().max(500).optional(),
  maxUsers: z.number().int().positive().max(10_000).optional(),
  imageUrl: z.string().trim().max(2000).nullable().optional(),
  specs: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: Request, context: RouteContext) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  const { id } = await context.params;
  const json = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const updated = await prisma.networkEquipment.update({
      where: { id },
      data: parsed.data,
    });

    await prisma.auditLog.create({
      data: { actorId: staff.session.user.id, action: "equipment.update", metadata: { id } },
    });

    return NextResponse.json({ equipment: updated });
  } catch (e) {
    console.error("[api/admin/equipment PUT]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  const { id } = await context.params;

  try {
    await prisma.networkEquipment.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { actorId: staff.session.user.id, action: "equipment.delete", metadata: { id } },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/equipment DELETE]", e);
    return databaseUnavailableResponse();
  }
}
