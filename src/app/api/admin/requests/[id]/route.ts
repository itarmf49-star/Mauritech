import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().max(5000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  const { id } = await context.params;
  const json = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ request: updated });
  } catch (e) {
    console.error("[api/admin/requests/[id] PATCH]", e);
    return databaseUnavailableResponse();
  }
}
