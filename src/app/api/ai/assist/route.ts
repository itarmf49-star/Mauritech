import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are MauriTech's senior network infrastructure assistant.
You specialize in residential internet, Wi-Fi deployment, fiber optic installation, structured cabling, enterprise LAN/WAN design, and network maintenance in Mauritania.
Rules:
- Focus exclusively on internet, Wi-Fi, and network infrastructure topics.
- Prefer concise, actionable guidance and checklists.
- If information is missing, ask clarifying questions.
- When estimating, provide ranges and assumptions; recommend on-site surveys for final quotes.
`.trim();

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

type Provider = "openai" | "gemini";

async function getPreferredProvider(): Promise<Provider> {
  try {
    const agent = await prisma.aIAgent.findFirst();
    const provider = (agent?.config as Record<string, unknown> | null)?.provider as string | undefined;
    if (provider === "gemini" || provider === "openai") return provider;
  } catch {
    // ignore DB errors and fall back to env-based detection
  }
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 0) return "gemini";
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.trim().length > 0) return "openai";
  return "openai";
}

export async function POST(req: Request) {
  const ip = clientKeyFromRequest(req);
  if (!rateLimit(`ai:assist:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);

  const provider = await getPreferredProvider();
  const body = (await req.json().catch(() => null)) as { prompt?: string } | null;
  const prompt = body?.prompt?.trim();
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  if (provider === "gemini") {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: "ai_unavailable" }, { status: 503 });
    }

    try {
      const mod = await import("@google/generative-ai");
      const genAI = new mod.GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.0-flash" });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          let assembled = "";
          try {
            const result = await model.generateContentStream({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: `${SYSTEM_PROMPT}\n\nUser: ${prompt}` },
                  ],
                },
              ],
            });

            for await (const chunk of result.stream) {
              const delta = chunk.text ?? "";
              if (delta) {
                assembled += delta;
                controller.enqueue(encoder.encode(sse({ type: "delta", value: delta })));
              }
            }

            try {
              await prisma.aiUsage.create({
                data: {
                  userId: session?.user?.id ? Number(session.user.id) : null,
                  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
                  tokens: Math.min(32_000, Math.ceil((prompt.length + assembled.length) / 4)),
                },
              });
            } catch (e) {
              console.warn("[api/ai/assist] AiUsage logging failed", e);
            }

            try {
              await prisma.auditLog.create({
                data: {
                  actorId: session?.user?.id ? Number(session.user.id) : null,
                  action: "ai.assist",
                  metadata: {
                    provider: "gemini",
                    promptLength: prompt.length,
                    answerLength: assembled.length,
                  },
                },
              });
            } catch (e) {
              console.warn("[api/ai/assist] AuditLog failed", e);
            }

            controller.enqueue(encoder.encode(sse({ type: "done" })));
          } catch {
            controller.enqueue(encoder.encode(sse({ type: "error" })));
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(stream, {
        status: 200,
        headers: {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache, no-transform",
          connection: "keep-alive",
        },
      });
    } catch {
      return NextResponse.json({ error: "ai_unavailable" }, { status: 503 });
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ai_unavailable" }, { status: 503 });
  }

  const encoder = new TextEncoder();
  const openai = new OpenAI({ apiKey });

  const completionStream = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      let assembled = "";
      try {
        for await (const part of completionStream) {
          const delta = part.choices[0]?.delta?.content ?? "";
          if (delta) {
            assembled += delta;
            controller.enqueue(encoder.encode(sse({ type: "delta", value: delta })));
          }
        }

        try {
          await prisma.aiUsage.create({
            data: {
              userId: session?.user?.id ? Number(session.user.id) : null,
              model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
              tokens: Math.min(32_000, Math.ceil((prompt.length + assembled.length) / 4)),
            },
          });
        } catch (e) {
          console.warn("[api/ai/assist] AiUsage logging failed", e);
        }

        try {
          await prisma.auditLog.create({
            data: {
              actorId: session?.user?.id ? Number(session.user.id) : null,
              action: "ai.assist",
              metadata: {
                provider: "openai",
                promptLength: prompt.length,
                answerLength: assembled.length,
              },
            },
          });
        } catch (e) {
          console.warn("[api/ai/assist] AuditLog failed", e);
        }

        controller.enqueue(encoder.encode(sse({ type: "done" })));
      } catch {
        controller.enqueue(encoder.encode(sse({ type: "error" })));
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
