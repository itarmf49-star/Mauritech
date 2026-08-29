import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";
    const priority = url.searchParams.get("priority") || "";

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const requirements = await prisma.requirement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const stats = {
      total: requirements.length,
      open: requirements.filter((r) => r.status === "OPEN").length,
      inProgress: requirements.filter((r) => r.status === "IN_PROGRESS").length,
      quoted: requirements.filter((r) => r.status === "QUOTED").length,
      completed: requirements.filter((r) => r.status === "COMPLETED").length,
    };

    return NextResponse.json({ requirements, stats });
  } catch (e) {
    console.error("[api/admin/requirements GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json();
    const requirement = await prisma.requirement.create({
      data: {
        title: body.title,
        description: body.description || "",
        category: body.category || "PRODUCT",
        priority: body.priority || "MEDIUM",
        status: body.status || "OPEN",
        contactName: body.contactName || "",
        contactEmail: body.contactEmail || "",
        contactPhone: body.contactPhone || "",
        budget: body.budget ? Number(body.budget) : undefined,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        assignedTo: body.assignedTo || "",
        notes: body.notes || "",
      },
    });

    return NextResponse.json({ requirement });
  } catch (e) {
    console.error("[api/admin/requirements POST]", e);
    return NextResponse.json({ error: "Failed to create requirement" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const body = await req.json();

    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.category !== undefined) data.category = body.category;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.status !== undefined) data.status = body.status;
    if (body.contactName !== undefined) data.contactName = body.contactName;
    if (body.contactEmail !== undefined) data.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined) data.contactPhone = body.contactPhone;
    if (body.budget !== undefined) data.budget = Number(body.budget);
    if (body.deadline !== undefined) data.deadline = body.deadline ? new Date(body.deadline) : null;
    if (body.assignedTo !== undefined) data.assignedTo = body.assignedTo;
    if (body.notes !== undefined) data.notes = body.notes;

    const requirement = await prisma.requirement.update({
      where: { id },
      data,
    });

    return NextResponse.json({ requirement });
  } catch (e) {
    console.error("[api/admin/requirements PATCH]", e);
    return NextResponse.json({ error: "Failed to update requirement" }, { status: 500 });
  }
}
