import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });

    const messages = await prisma.chatMessage.findMany({
      where: { session: { sessionId } },
      include: { session: { select: { id: true, sessionId: true, status: true } } },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    return NextResponse.json({ messages });
  } catch (e) {
    console.error("[api/chat GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const rawUid = (session as { user?: { id?: string | number } } | null)?.user?.id;
    const userId = rawUid ? (typeof rawUid === "string" ? Number(rawUid) : (rawUid as number)) : undefined;

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const { sessionId, content, senderName, senderType, isAi, attachments } = body;

    if (!isNonEmptyString(sessionId)) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    if (!isNonEmptyString(content)) return NextResponse.json({ error: "content is required" }, { status: 400 });

    let chatSession = await prisma.chatSession.findUnique({ where: { sessionId } });

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          sessionId,
          userId,
          customerName: (session as { user?: { name?: string } } | null)?.user?.name || senderName || "Guest",
          customerEmail: (session as { user?: { email?: string } } | null)?.user?.email || null,
          status: "ACTIVE",
        },
      });
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        content: content.trim(),
        senderType: ((senderType as string | undefined) === "AGENT" || senderType === "SYSTEM" || senderType === "AI" ? (senderType as string) : "CUSTOMER") as any,
        senderName: typeof senderName === "string" ? senderName.trim() : null,
        isAi: typeof isAi === "boolean" ? isAi : false,
        attachments: attachments ?? null,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (e) {
    console.error("[api/chat POST]", e);
    return databaseUnavailableResponse();
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
