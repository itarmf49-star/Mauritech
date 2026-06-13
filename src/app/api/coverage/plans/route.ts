import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { optionalInputJsonSchema } from "@/lib/prisma-json";

export const runtime = "nodejs";

const BodySchema = z.object({
  areaSqm: z.number().int().min(1).max(200_000),
  floors: z.number().int().min(1).max(80),
  wallLossDb: z.number().int().min(0).max(40),
  recommendedAps: z.number().int().min(1).max(256),
  recommendedSwitches: z.number().int().min(1).max(256),
  rooms: z.number().int().min(1).max(200).optional(),
  wallType: z.string().optional(),
  desiredSpeedMbps: z.number().int().optional(),
  deviceCount: z.number().int().optional(),
  recommendedOutlets: z.number().int().optional(),
  floorPlanJson: optionalInputJsonSchema,
  recommendationsJson: optionalInputJsonSchema,
  equipmentCost: z.number().int().optional(),
  installCost: z.number().int().optional(),
  totalCost: z.number().int().optional(),
  coverageQuality: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = `coverage:get:${session.user.id}`;
  if (!rateLimit(key, 120, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const plans = await prisma.coveragePlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ plans });
  } catch (e) {
    console.error("[api/coverage/plans GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ipKey = clientKeyFromRequest(req);
  if (!rateLimit(`coverage:post:${ipKey}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const plan = await prisma.coveragePlan.create({
      data: {
        userId: session.user.id,
        areaSqm: parsed.data.areaSqm,
        floors: parsed.data.floors,
        wallLossDb: parsed.data.wallLossDb,
        recommendedAps: parsed.data.recommendedAps,
        recommendedSwitches: parsed.data.recommendedSwitches,
        rooms: parsed.data.rooms,
        wallType: parsed.data.wallType,
        desiredSpeedMbps: parsed.data.desiredSpeedMbps,
        deviceCount: parsed.data.deviceCount,
        recommendedOutlets: parsed.data.recommendedOutlets,
        floorPlanJson: parsed.data.floorPlanJson ?? undefined,
        recommendationsJson: parsed.data.recommendationsJson ?? undefined,
        equipmentCost: parsed.data.equipmentCost,
        installCost: parsed.data.installCost,
        totalCost: parsed.data.totalCost,
        coverageQuality: parsed.data.coverageQuality,
      },
    });
    return NextResponse.json({ plan }, { status: 201 });
  } catch (e) {
    console.error("[api/coverage/plans POST]", e);
    return databaseUnavailableResponse();
  }
}
