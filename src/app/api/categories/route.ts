import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (e) {
    console.error("[api/categories GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { name, slug, description, image, parentId } = body;

    if (!isNonEmptyString(name)) return NextResponse.json({ error: "name is required" }, { status: 400 });
    if (!isNonEmptyString(slug)) return NextResponse.json({ error: "slug is required" }, { status: 400 });

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
        parentId: parentId?.trim() || null,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (e) {
    console.error("[api/categories POST]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
