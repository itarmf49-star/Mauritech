import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  title?: string;
  description?: string;
  priority?: string;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { updates: { orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ tickets });
  } catch (e) {
    console.error("[api/portal/tickets GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Body;
  const title = body.title?.trim();
  const description = body.description?.trim();
  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }
  try {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        title,
        description,
        priority: body.priority?.trim() || "normal",
        updates: {
          create: {
            authorId: userId,
            message: "Ticket created from client portal.",
          },
        },
      },
      include: { updates: true },
    });
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (e) {
    console.error("[api/portal/tickets POST]", e);
    return databaseUnavailableResponse();
  }
}
