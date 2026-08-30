import { prisma } from "@/lib/prisma";
import type { SiteSettings } from "@prisma/client";

export type GlobalSettings = Partial<SiteSettings> & {
  primaryColor: string;
  cardRadius: number;
  glassOpacity: number;
};

const defaultSettings: GlobalSettings = {
  primaryColor: "#F5C542",
  cardRadius: 16,
  glassOpacity: 0.15,
};

export async function getGlobalSettings(): Promise<GlobalSettings> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings ? { ...defaultSettings, ...settings } : defaultSettings;
  } catch {
    // Database not reachable (expected in local development without a database)
    return defaultSettings;
  }
}
