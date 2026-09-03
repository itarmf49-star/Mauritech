import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const siteSettings = await prisma.siteSettings.findFirst();
    const aiAgent = await prisma.aIAgent.findFirst();
    const socialIntegrations = await prisma.socialIntegration.findMany();

    return NextResponse.json({
      siteSettings: siteSettings || {
        siteName: "MauriTech",
        logoUrl: "",
        logoDarkUrl: "",
        faviconUrl: "",
        seoTitle: "",
        seoDesc: "",
        ogImage: "",
        facebook: "",
        instagram: "",
        x: "",
        youtube: "",
      },
      aiAgent: aiAgent || {
        name: "Mauri Assistant",
        description: "Internet & networking assistant",
        isActive: true,
        systemPrompt: "You are a helpful assistant for MauriTech, an internet and networking company.",
        model: "gpt-4o-mini",
        temperature: 0.7,
        maxTokens: 1000,
        capabilities: {},
        config: {},
      },
      socialIntegrations: socialIntegrations.some((s) => s.platform === "WHATSAPP")
        ? socialIntegrations.map((s) => ({
            id: s.id,
            platform: s.platform,
            isActive: s.isActive,
            webhookUrl: s.webhookUrl,
            apiKey: s.apiKey,
            phoneNumber: s.phoneNumber,
            displayName: s.displayName,
          }))
        : [
            {
              id: "new-whatsapp",
              platform: "WHATSAPP",
              isActive: false,
              webhookUrl: "",
              apiKey: "",
              phoneNumber: "",
              displayName: "",
            },
            ...socialIntegrations.map((s) => ({
              id: s.id,
              platform: s.platform,
              isActive: s.isActive,
              webhookUrl: s.webhookUrl,
              apiKey: s.apiKey,
              phoneNumber: s.phoneNumber,
              displayName: s.displayName,
            })),
          ],
    });
  } catch (e) {
    console.error("[api/admin/settings GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function PATCH(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const body = await req.json();

    if (body.siteSettings) {
      const existing = await prisma.siteSettings.findFirst();
      if (existing) {
        await prisma.siteSettings.update({
          where: { id: existing.id },
          data: {
            siteName: body.siteSettings.siteName ?? existing.siteName,
            logoUrl: body.siteSettings.logoUrl ?? existing.logoUrl,
            logoDarkUrl: body.siteSettings.logoDarkUrl ?? existing.logoDarkUrl,
            faviconUrl: body.siteSettings.faviconUrl ?? existing.faviconUrl,
            seoTitle: body.siteSettings.seoTitle ?? existing.seoTitle,
            seoDesc: body.siteSettings.seoDesc ?? existing.seoDesc,
            ogImage: body.siteSettings.ogImage ?? existing.ogImage,
            facebook: body.siteSettings.facebook ?? existing.facebook,
            instagram: body.siteSettings.instagram ?? existing.instagram,
            x: body.siteSettings.x ?? existing.x,
            youtube: body.siteSettings.youtube ?? existing.youtube,
          },
        });
      } else {
        await prisma.siteSettings.create({
          data: {
            siteName: body.siteSettings.siteName || "MauriTech",
            logoUrl: body.siteSettings.logoUrl || "",
            logoDarkUrl: body.siteSettings.logoDarkUrl || "",
            faviconUrl: body.siteSettings.faviconUrl || "",
            seoTitle: body.siteSettings.seoTitle || "",
            seoDesc: body.siteSettings.seoDesc || "",
            ogImage: body.siteSettings.ogImage || "",
            facebook: body.siteSettings.facebook || "",
            instagram: body.siteSettings.instagram || "",
            x: body.siteSettings.x || "",
            youtube: body.siteSettings.youtube || "",
          },
        });
      }
    }

    if (body.aiAgent) {
      const existing = await prisma.aIAgent.findFirst();
      if (existing) {
        await prisma.aIAgent.update({
          where: { id: existing.id },
          data: {
            name: body.aiAgent.name ?? existing.name,
            description: body.aiAgent.description ?? existing.description,
            isActive: body.aiAgent.isActive ?? existing.isActive,
            systemPrompt: body.aiAgent.systemPrompt ?? existing.systemPrompt,
            model: body.aiAgent.model ?? existing.model,
            temperature: body.aiAgent.temperature ?? existing.temperature,
            maxTokens: body.aiAgent.maxTokens ?? existing.maxTokens,
            capabilities: body.aiAgent.capabilities ?? existing.capabilities,
            config: body.aiAgent.config ?? existing.config,
          },
        });
      } else {
        await prisma.aIAgent.create({
          data: {
            name: body.aiAgent.name || "Mauri Assistant",
            description: body.aiAgent.description || "",
            isActive: body.aiAgent.isActive ?? true,
            systemPrompt: body.aiAgent.systemPrompt || "",
            model: body.aiAgent.model || "gpt-4o-mini",
            temperature: body.aiAgent.temperature ?? 0.7,
            maxTokens: body.aiAgent.maxTokens ?? 1000,
            capabilities: body.aiAgent.capabilities || {},
            config: body.aiAgent.config || {},
          },
        });
      }
    }

    if (body.socialIntegrations) {
      for (const integration of body.socialIntegrations) {
        const existing = await prisma.socialIntegration.findUnique({
          where: { platform: integration.platform },
        });

        if (existing) {
          await prisma.socialIntegration.update({
            where: { platform: integration.platform },
            data: {
              isActive: integration.isActive ?? existing.isActive,
              webhookUrl: integration.webhookUrl ?? existing.webhookUrl,
              apiKey: integration.apiKey ?? existing.apiKey,
              apiSecret: integration.apiSecret ?? existing.apiSecret,
              phoneNumber: integration.phoneNumber ?? existing.phoneNumber,
              displayName: integration.displayName ?? existing.displayName,
              config: integration.config ?? existing.config,
            },
          });
        } else {
          await prisma.socialIntegration.create({
            data: {
              platform: integration.platform,
              isActive: integration.isActive ?? true,
              webhookUrl: integration.webhookUrl || "",
              apiKey: integration.apiKey || "",
              apiSecret: integration.apiSecret || "",
              phoneNumber: integration.phoneNumber || "",
              displayName: integration.displayName || "",
              config: integration.config || {},
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/admin/settings PATCH]", e);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
