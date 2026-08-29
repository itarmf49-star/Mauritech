import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff-api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const staff = await getStaffSession();
    const isAdmin = staff.ok;
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (!isAdmin) {
      const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
      if (rawUid) where.source = "web";
    }
    if (status) where.status = status;
    if (category) where.category = category;

    const requirements = await prisma.requirement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ requirements });
  } catch (e) {
    console.error("[api/requirements GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { title, description, category, priority, contactName, contactEmail, contactPhone, budget, deadline } = body;

    if (!isNonEmptyString(title)) return NextResponse.json({ error: "title is required" }, { status: 400 });

    const requirement = await prisma.requirement.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category: category || "PRODUCT",
        priority: priority || "MEDIUM",
        contactName: contactName?.trim() || (session as { user?: { name?: string } } | null)?.user?.name || null,
        contactEmail: contactEmail?.trim() || (session as { user?: { email?: string } } | null)?.user?.email || null,
        contactPhone: contactPhone?.trim() || null,
        budget: budget ? Number(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        source: "web",
      },
    });

    return NextResponse.json({ requirement }, { status: 201 });
  } catch (e) {
    console.error("[api/requirements POST]", e);
    return databaseUnavailableResponse();
  }
}

export async function PUT(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { id, status, priority, assignedTo, notes, category, deadline } = body;

    if (!isNonEmptyString(id)) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (priority) data.priority = priority;
    if (assignedTo !== undefined) data.assignedTo = assignedTo?.trim() || null;
    if (notes !== undefined) data.notes = notes?.trim() || null;
    if (category) data.category = category;
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null;

    const requirement = await prisma.requirement.update({
      where: { id },
      data,
    });

    return NextResponse.json({ requirement });
  } catch (e) {
    console.error("[api/requirements PUT]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
