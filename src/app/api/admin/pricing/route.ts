import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  unit: z.enum(["ap", "sqm", "outlet", "hour", "router"]),
  basePrice: z.number().int().nonnegative().max(100_000_000),
  currency: z.string().trim().min(1).max(8).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const pricing = await prisma.installationPricing.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      take: 200,
    });
    return NextResponse.json({ pricing });
  } catch (e) {
    console.error("[api/admin/pricing GET]", e);
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
    const created = await prisma.installationPricing.create({
      data: {
        name: parsed.data.name,
        unit: parsed.data.unit,
        basePrice: parsed.data.basePrice,
        currency: parsed.data.currency ?? "MRU",
        isActive: parsed.data.isActive ?? true,
      },
    });
    return NextResponse.json({ pricing: created }, { status: 201 });
  } catch (e) {
    console.error("[api/admin/pricing POST]", e);
    return databaseUnavailableResponse();
  }
}
