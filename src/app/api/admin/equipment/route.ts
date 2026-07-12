import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { optionalInputJsonSchema } from "@/lib/prisma-json";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  manufacturer: z.string().trim().min(1).max(120),
  deviceType: z.enum(["ROUTER", "ACCESS_POINT", "MESH_NODE"]),
  price: z.number().int().nonnegative().max(100_000_000),
  coverageRadiusM: z.number().positive().max(500),
  maxUsers: z.number().int().positive().max(10_000),
  imageUrl: z.string().trim().max(2000).nullable().optional(),
  specs: optionalInputJsonSchema,
  isActive: z.boolean().optional(),
});

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const equipment = await prisma.networkEquipment.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      take: 500,
    });
    return NextResponse.json({ equipment });
  } catch (e) {
    console.error("[api/admin/equipment GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  const json = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const created = await prisma.networkEquipment.create({
      data: {
        name: parsed.data.name,
        manufacturer: parsed.data.manufacturer,
        deviceType: parsed.data.deviceType,
        price: parsed.data.price,
        coverageRadiusM: parsed.data.coverageRadiusM,
        maxUsers: parsed.data.maxUsers,
        imageUrl: parsed.data.imageUrl ?? null,
        specs: parsed.data.specs ?? undefined,
        isActive: parsed.data.isActive ?? true,
      },
    });

    await prisma.auditLog.create({
      data: { actorId: Number(staff.session.user.id), action: "equipment.create", metadata: { id: created.id } },
    });

    return NextResponse.json({ equipment: created }, { status: 201 });
  } catch (e) {
    console.error("[api/admin/equipment POST]", e);
    return databaseUnavailableResponse();
  }
}
