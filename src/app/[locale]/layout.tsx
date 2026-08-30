import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import { SiteFooter } from "@/components/site-footer";
import { defaultLocale, getDirection, isLocale, t, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/content";
import { BRAND_NAME } from "@/lib/config";
import { AppProviders } from "@/components/providers/app-providers";
import { ChatDock } from "@/components/chat/chat-dock";
import { AiAssistant } from "@/components/chat/ai-assistant";
import { getGlobalSettings } from "@/lib/settings";
import { WhatsAppWidget } from "@/components/whatsapp-widget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-arabic",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: t(locale, "metaTitle", { brand: BRAND_NAME }),
      template: `%s | ${BRAND_NAME}`,
    },
    description: t(locale, "metaDescription", { brand: BRAND_NAME }),
    openGraph: {
      title: t(locale, "metaTitle", { brand: BRAND_NAME }),
      description: t(locale, "metaDescription", { brand: BRAND_NAME }),
      url: `${siteConfig.siteUrl}/${locale}`,
      siteName: BRAND_NAME,
      images: [{ url: "/images/hero-en.svg", width: 1200, height: 630, alt: `${BRAND_NAME} preview` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t(locale, "metaTitle", { brand: BRAND_NAME }),
      description: t(locale, "metaDescription", { brand: BRAND_NAME }),
      images: ["/images/hero-en.svg"],
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        ar: "/ar",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dir = getDirection(locale);
  const fontClass = locale === "ar" ? cairo.variable : inter.variable;
  
  // جلب الإعدادات من قاعدة البيانات للتحكم الديناميكي
  const settings = await getGlobalSettings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: siteConfig.siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: ["Mauritania", "West Africa"],
    sameAs: [siteConfig.siteUrl],
  };

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cairo.variable} ${fontClass}`}>
      <body
        style={{
          "--primary-color": settings.primaryColor || "#F5C542",
          "--card-radius": `${settings.cardRadius || 16}px`,
          "--glass-opacity": settings.glassOpacity || 0.15,
        } as React.CSSProperties}
        className="theme-container"
      >
        <AppProviders>
          <a href="#main-content" className="skip-link">
            {t(locale, "skipToContent")}
          </a>
          <main id="main-content">{children}</main>
          <SiteFooter locale={locale} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
          <ChatDock locale={locale} />
          <AiAssistant locale={locale} />
          <WhatsAppWidget locale={locale} />
        </AppProviders>
      </body>
    </html>
  );
}
