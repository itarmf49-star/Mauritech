import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";
import { getStoreScope } from "@/lib/store-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const VALID_ROLES = ["OWNER", "MANAGER", "STAFF"] as const;

/** إسناد مستخدم لإدارة متجر — ينشئ حساباً جديداً بالبريد إن لم يكن موجوداً (السوبر أدمن فقط). */
export async function POST(req: Request, { params }: Params) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id: storeId } = await params;
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!scope.isSuperAdmin) {
      return NextResponse.json({ error: "لا تملك صلاحية إسناد مدراء متاجر" }, { status: 403 });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId }, select: { id: true } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = VALID_ROLES.includes(body.role) ? body.role : "MANAGER";

    if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      if (!password || password.length < 8) {
        return NextResponse.json({ error: "لإنشاء مستخدم جديد يجب إدخال كلمة مرور من 8 أحرف على الأقل" }, { status: 400 });
      }
      const hashed = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: { email, name: name || email.split("@")[0], password: hashed, role: "EDITOR" },
      });
    }

    const storeUser = await prisma.storeUser.upsert({
      where: { storeId_userId: { storeId, userId: user.id } },
      update: { role },
      create: { storeId, userId: user.id, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ storeUser }, { status: 201 });
  } catch (e) {
    console.error("[api/admin/stores/:id/users POST]", e);
    return databaseUnavailableResponse();
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const { id: storeId } = await params;
    const scope = await getStoreScope(staff.session.user.id, staff.session.user.role);
    if (!scope.isSuperAdmin) {
      return NextResponse.json({ error: "لا تملك صلاحية إزالة مدراء متاجر" }, { status: 403 });
    }

    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("userId"));
    if (!Number.isFinite(userId)) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    await prisma.storeUser.delete({ where: { storeId_userId: { storeId, userId } } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/stores/:id/users DELETE]", e);
    return databaseUnavailableResponse();
  }
}
