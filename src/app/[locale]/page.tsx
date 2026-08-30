import { AmazonHome } from "@/components/shop/amazon-home";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({
  params,
}: HomePageProps) {
  const { locale: raw } = await params;

  const locale: Locale = isLocale(raw)
    ? raw
    : defaultLocale;

  return <AmazonHome locale={locale as "fr" | "ar"} />;
}
