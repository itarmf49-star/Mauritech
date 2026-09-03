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
    const sessionId = url.searchParams.get("sessionId");

    if (sessionId) {
      const session = await prisma.chatSession.findUnique({
        where: { sessionId },
        include: { user: { select: { name: true, email: true } } },
      });

      if (!session) return NextResponse.json({ session: null, messages: [] });

      const messages = await prisma.chatMessage.findMany({
        where: { sessionId: session.id },
        orderBy: { createdAt: "asc" },
        take: 200,
      });

      return NextResponse.json({ session, messages });
    }

    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ sessions });
  } catch (e) {
    console.error("[api/admin/chat GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json();
    const { sessionId, status, assignedTo, aiHandled } = body;

    const session = await prisma.chatSession.update({
      where: { sessionId },
      data: {
        ...(status !== undefined && { status }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(aiHandled !== undefined && { aiHandled }),
      },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ session });
  } catch (e) {
    console.error("[api/admin/chat PATCH]", e);
    return NextResponse.json({ error: "Failed to update chat session" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json();
    const { sessionId, content, senderType = "AGENT", senderName = "Admin" } = body;

    // sessionId القادم من الواجهة هو الحقل النصي (ChatSession.sessionId)، بينما
    // ChatMessage.sessionId مفتاح أجنبي يشير إلى ChatSession.id — لازم نحل المرجع أولاً.
    const chatSession = await prisma.chatSession.update({
      where: { sessionId },
      data: { updatedAt: new Date() },
    });

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        senderType,
        senderName,
        content,
        isAi: false,
        isRead: true,
      },
    });

    return NextResponse.json({ message });
  } catch (e) {
    console.error("[api/admin/chat POST]", e);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
