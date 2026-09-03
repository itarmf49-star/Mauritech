import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    console.error("[api/admin/requirements/[id] PATCH]", e);
    return NextResponse.json({ error: "Failed to update requirement" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    await prisma.requirement.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/requirements/[id] DELETE]", e);
    return databaseUnavailableResponse();
  }
}
