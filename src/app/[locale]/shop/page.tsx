import { redirect } from "next/navigation";
import { defaultLocale, isLocale, localePath, type Locale } from "@/lib/i18n";

type ShopRedirectProps = { params: Promise<{ locale: string }> };

/** المتجر أصبح الواجهة الرئيسية للموقع — هذا المسار يبقى فقط لأي روابط قديمة. */
export default async function ShopRedirectPage({ params }: ShopRedirectProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  redirect(localePath(locale, "/"));
}
