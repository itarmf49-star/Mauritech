import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  unit: z.enum(["ap", "sqm", "outlet", "hour", "router"]).optional(),
  basePrice: z.number().int().nonnegative().max(100_000_000).optional(),
  currency: z.string().trim().min(1).max(8).optional(),
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
    const updated = await prisma.installationPricing.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ pricing: updated });
  } catch (e) {
    console.error("[api/admin/pricing PUT]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  const { id } = await context.params;

  try {
    await prisma.installationPricing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/pricing DELETE]", e);
    return databaseUnavailableResponse();
  }
}
