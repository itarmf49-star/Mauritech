import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { optionalInputJsonSchema } from "@/lib/prisma-json";

export const runtime = "nodejs";

const BodySchema = z.object({
  type: z.enum(["SITE_SURVEY", "INSTALLATION", "CONSULTATION"]).default("CONSULTATION"),
  name: z.string().trim().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(5000).optional(),
  estimateId: z.string().optional(),
  metadata: optionalInputJsonSchema,
});

export async function POST(req: Request) {
  const ipKey = clientKeyFromRequest(req);
  if (!rateLimit(`requests:post:${ipKey}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const request = await prisma.serviceRequest.create({
      data: {
        type: parsed.data.type,
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
        notes: parsed.data.notes || null,
        estimateId: parsed.data.estimateId || null,
        metadata: parsed.data.metadata ?? undefined,
      },
    });
    return NextResponse.json({ request }, { status: 201 });
  } catch (e) {
    console.error("[api/requests POST]", e);
    return databaseUnavailableResponse();
  }
}
