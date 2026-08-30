import { prisma } from "@/lib/prisma";

export async function getGlobalSettings() {
  try {
    // Try to fetch settings from database using correct model name
    const settings = await prisma.siteSettings.findFirst();
    
    // Return values or defaults if database is empty
    return settings || {
      primaryColor: "#F5C542",
      cardRadius: 16,
      glassOpacity: 0.15
    };
  } catch (error) {
    // Silently return defaults if database is not connected
    // This is expected in development without database setup
    return {
      primaryColor: "#F5C542",
      cardRadius: 16,
      glassOpacity: 0.15
    };
  }
}
