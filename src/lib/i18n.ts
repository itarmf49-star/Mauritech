import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import ar from "../../messages/ar.json";
import type { Localized } from "@/types/content";

export type Locale = "en" | "fr" | "ar";

export const locales: Locale[] = ["en", "fr", "ar"];
export const defaultLocale: Locale = "en";

export type Messages = typeof en;
export type MessageKey = keyof Messages;

// تم التعديل هنا: استخدام any لتجنب خطأ التضارب في مفاتيح ملفات الترجمة (JSON)
const dict: Record<Locale, any> = { 
  en: en as Messages, 
  fr: fr as any, 
  ar: ar as any 
};

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getMessages(locale: Locale): Messages {
  return dict[locale] ?? dict.en;
}

export function t(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number | null | undefined>,
) {
  const messages = getMessages(locale);
  const raw = messages[key] ?? dict.en[key] ?? "";
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_: string, k: string) => {
    const v = vars[k];
    return v == null ? "" : String(v);
  });
}

export function localePath(locale: Locale, path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

/** دالة مركزية لاستخراج النصوص من الكائنات المترجمة (Localized) */
export function txt(content: Localized | string | undefined, locale: Locale): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  // الترتيب: اللغة الحالية، ثم الفرنسية (كمصدر أساسي)، ثم فارغ
  return (content[locale] || content["fr"] || "") as string;
}

/** Coverage quality labels keyed for `t()`. */
export const coverageQualityMessageKey = {
  excellent: "coverageQuality_excellent",
  good: "coverageQuality_good",
  fair: "coverageQuality_fair",
} as const satisfies Record<"excellent" | "good" | "fair", MessageKey>;

export type CoverageQualityLevel = keyof typeof coverageQualityMessageKey;

export function coverageQualityLabel(locale: Locale, quality: CoverageQualityLevel) {
  return t(locale, coverageQualityMessageKey[quality]);
}

/** Trust strip stat rows. */
export const TRUST_STRIP_ITEMS: ReadonlyArray<{ value: MessageKey; label: MessageKey }> = [
  { value: "trustItem1Value", label: "trustItem1Label" },
  { value: "trustItem2Value", label: "trustItem2Label" },
  { value: "trustItem3Value", label: "trustItem3Label" },
  { value: "trustItem4Value", label: "trustItem4Label" },
];

/** How-it-works process steps. */
export const HOW_IT_WORKS_STEPS: ReadonlyArray<{ title: MessageKey; description: MessageKey }> = [
  { title: "step1Title", description: "step1Description" },
  { title: "step2Title", description: "step2Description" },
  { title: "step3Title", description: "step3Description" },
  { title: "step4Title", description: "step4Description" },
];

/** Nav link keys used in the site header. */
export const NAV_LINK_KEYS = [
  "navHome",
  "navServices",
  "navCoverage",
  "navProjects",
  "navAbout",
  "navContactLink",
] as const satisfies readonly MessageKey[];

export type NavLinkKey = (typeof NAV_LINK_KEYS)[number];
