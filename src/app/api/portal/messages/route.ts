import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Body = {
  subject?: string;
  body?: string;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: { email: session.user.email },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = (await req.json().catch(() => ({}))) as Body;
  const subject = json.subject?.trim() || "Customer portal message";
  const body = json.body?.trim();

  if (!body) {
    return NextResponse.json({ error: "Message body is required" }, { status: 400 });
  }

  const created = await prisma.message.create({
    data: {
      name: session.user.name?.trim() || "Customer",
      email: session.user.email,
      subject,
      body,
    },
  });

  return NextResponse.json({ message: created }, { status: 201 });
}
