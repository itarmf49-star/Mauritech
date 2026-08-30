import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = typeof userId === "string" ? Number(userId) : (userId as number);

  try {
    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: uid },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: { userId: uid },
      });
    }

    return NextResponse.json({ preferences });
  } catch (e) {
    console.error("[api/portal/notifications/preferences GET]", e);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = typeof userId === "string" ? Number(userId) : (userId as number);

  try {
    const body = await req.json();
    
    const updateData: any = {};
    if (body.emailEnabled !== undefined) updateData.emailEnabled = body.emailEnabled;
    if (body.inAppEnabled !== undefined) updateData.inAppEnabled = body.inAppEnabled;
    if (body.invoiceNotifications !== undefined) updateData.invoiceNotifications = body.invoiceNotifications;
    if (body.ticketNotifications !== undefined) updateData.ticketNotifications = body.ticketNotifications;
    if (body.projectNotifications !== undefined) updateData.projectNotifications = body.projectNotifications;
    if (body.systemNotifications !== undefined) updateData.systemNotifications = body.systemNotifications;
    if (body.digestMode !== undefined) updateData.digestMode = body.digestMode;

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: uid },
      update: updateData,
      create: { userId: uid, ...updateData },
    });

    return NextResponse.json({ preferences });
  } catch (e) {
    console.error("[api/portal/notifications/preferences PATCH]", e);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}