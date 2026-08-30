import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserNotifications, getUnreadNotificationCount, markAllNotificationsAsRead } from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = typeof userId === "string" ? Number(userId) : (userId as number);

  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    
    const notifications = uid && !isNaN(uid) ? await getUserNotifications(uid, limit) : [];
    const unreadCount = uid && !isNaN(uid) ? await getUnreadNotificationCount(uid) : 0;

    return NextResponse.json({ notifications, unreadCount });
  } catch (e) {
    console.error("[api/portal/notifications GET]", e);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = typeof userId === "string" ? Number(userId) : (userId as number);

  if (!uid || isNaN(uid)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { action, notificationId } = body;

    if (action === "markAllRead") {
      await markAllNotificationsAsRead(uid);
      return NextResponse.json({ success: true });
    }

    if (action === "markRead" && notificationId) {
      const { markNotificationAsRead } = await import("@/lib/notifications");
      await markNotificationAsRead(notificationId, uid);
      return NextResponse.json({ success: true });
    }

    if (action === "archive" && notificationId) {
      const { archiveNotification } = await import("@/lib/notifications");
      await archiveNotification(notificationId, uid);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    console.error("[api/portal/notifications PATCH]", e);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}