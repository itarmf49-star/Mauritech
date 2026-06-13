import { NextResponse } from "next/server";
import { z } from "zod";
import { computeCoverageEstimate } from "@/lib/coverage-engine";
import { prisma } from "@/lib/prisma";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const runtime = "nodejs";

const BodySchema = z.object({
  areaSqm: z.number().int().min(20).max(20000),
  rooms: z.number().int().min(1).max(100),
  floors: z.number().int().min(1).max(40),
  wallType: z.enum(["standard", "reinforced_concrete"]),
  desiredSpeedMbps: z.number().int().min(10).max(10000),
  deviceCount: z.number().int().min(1).max(500),
});

export async function POST(req: Request) {
  const ipKey = clientKeyFromRequest(req);
  if (!rateLimit(`coverage:estimate:${ipKey}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const [equipment, pricing] = await Promise.all([
      prisma.networkEquipment.findMany({ where: { isActive: true }, orderBy: { price: "asc" }, take: 100 }).catch(() => []),
      prisma.installationPricing.findMany({ where: { isActive: true }, take: 50 }).catch(() => []),
    ]);

    const equipmentRecords = equipment.map((e) => ({
      id: e.id,
      name: e.name,
      manufacturer: e.manufacturer,
      deviceType: e.deviceType,
      price: e.price,
      coverageRadiusM: e.coverageRadiusM,
      maxUsers: e.maxUsers,
    }));

    const pricingRecords = pricing.map((p) => ({ unit: p.unit, basePrice: p.basePrice }));

    const result = computeCoverageEstimate(parsed.data, equipmentRecords, pricingRecords);
    return NextResponse.json({ estimate: result });
  } catch (e) {
    console.error("[api/coverage/estimate POST]", e);
    const result = computeCoverageEstimate(parsed.data);
    return NextResponse.json({ estimate: result });
  }
}
