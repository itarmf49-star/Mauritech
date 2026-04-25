import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  name?: string;
  phone?: string;
  info?: string;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, info: true, role: true },
    });
    return NextResponse.json({ profile: user });
  } catch (e) {
    console.error("[api/portal/profile GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name?.trim() || undefined,
        phone: body.phone?.trim() || undefined,
        info: body.info?.trim() || undefined,
      },
      select: { id: true, name: true, email: true, phone: true, info: true, role: true },
    });
    return NextResponse.json({ profile: user });
  } catch (e) {
    console.error("[api/portal/profile PATCH]", e);
    return databaseUnavailableResponse();
  }
}
