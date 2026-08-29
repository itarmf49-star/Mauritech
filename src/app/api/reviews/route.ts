import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getStaffSession } from "@/lib/staff-api";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    const where: Record<string, unknown> = { isApproved: true };
    if (productId) where.productId = productId;

    const reviews = await prisma.review.findMany({
      where,
      include: { user: { select: { id: true, name: true } }, product: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ reviews });
  } catch (e) {
    console.error("[api/reviews GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
    const userId = rawUid ? (typeof rawUid === "string" ? Number(rawUid) : (rawUid as number)) : undefined;

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { productId, rating, comment, userName } = body;

    if (!isNonEmptyString(productId)) return NextResponse.json({ error: "productId is required" }, { status: 400 });
    if (typeof rating !== "number" || rating < 1 || rating > 5) return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        userName: typeof userName === "string" ? userName.trim() : (session as { user?: { name?: string } } | null)?.user?.name || "Anonymous",
        rating,
        comment: typeof comment === "string" ? comment.trim() : null,
        isVerified: !!userId,
        isApproved: false,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (e) {
    console.error("[api/reviews POST]", e);
    return databaseUnavailableResponse();
  }
}

export async function PUT(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { id, isApproved } = body;

    if (!isNonEmptyString(id)) return NextResponse.json({ error: "id is required" }, { status: 400 });
    if (typeof isApproved !== "boolean") return NextResponse.json({ error: "isApproved must be a boolean" }, { status: 400 });

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json({ review });
  } catch (e) {
    console.error("[api/reviews PUT]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
