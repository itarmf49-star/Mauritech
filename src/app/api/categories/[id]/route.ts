import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const data: any = {};
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.slug !== undefined) data.slug = String(body.slug).trim();
    if (body.description !== undefined) data.description = body.description?.trim() || null;
    if (body.image !== undefined) data.image = body.image?.trim() || null;
    if (body.parentId !== undefined) data.parentId = body.parentId?.trim() || null;
    if (body.isActive !== undefined) data.isActive = !!body.isActive;

    const category = await prisma.category.update({ where: { id }, data });
    return NextResponse.json({ category });
  } catch (e) {
    console.error("[api/categories/[id] PATCH]", e);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id } = await params;
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف الفئة — مرتبطة بـ ${productsCount} منتج. أزل المنتجات من الفئة أولاً.` },
        { status: 409 },
      );
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/categories/[id] DELETE]", e);
    return databaseUnavailableResponse();
  }
}
