import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const DEFAULT_DESIGN_SETTINGS = {
  primaryColor: "#F5C542",
  cardRadius: 16,
  glassOpacity: 0.15,
};

async function fetchGlobalSettings() {
  try {
    const settings = await prisma.designSettings.findFirst();
    return settings || DEFAULT_DESIGN_SETTINGS;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEFAULT_DESIGN_SETTINGS;
  }
}

// يُستدعى من التخطيط الجذري (layout.tsx) لكل صفحة في الموقع — بدون هذا التخزين
// المؤقت كان كل تنقّل بين الصفحات يُطلق استعلام قاعدة بيانات جديداً قبل أي رسم،
// وهو ما كان السبب الرئيسي وراء بطء التنقل بين الواجهات. القيم تتغيّر نادراً جداً،
// فالتخزين لمدة 5 دقائق آمن تماماً — أي تغيير من لوحة الإعدادات يظهر خلال 5 دقائق كحد أقصى.
export const getGlobalSettings = unstable_cache(fetchGlobalSettings, ["global-design-settings"], {
  revalidate: 300,
  tags: ["design-settings"],
});
