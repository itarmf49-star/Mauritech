import { prisma } from "@/lib/prisma";

export async function getGlobalSettings() {
  try {
    // محاولة جلب الإعدادات من القاعدة
   const settings = await (prisma as any).globalSettings.findFirst();
    
    // إرجاع القيم أو قيم افتراضية إذا كانت القاعدة فارغة
    return settings || {
      primaryColor: "#F5C542",
      cardRadius: 16,
      glassOpacity: 0.15
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    // إرجاع قيم افتراضية في حال وجود خطأ في الاتصال بالقاعدة
    return {
      primaryColor: "#F5C542",
      cardRadius: 16,
      glassOpacity: 0.15
    };
  }
}
