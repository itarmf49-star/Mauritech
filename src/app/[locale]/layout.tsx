import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { defaultLocale, getDirection, isLocale, t, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/content";
import { BRAND_NAME } from "@/lib/config";
import { FiberNetworkBackground } from "@/components/three/FiberNetworkBackground";
import { AppProviders } from "@/components/providers/app-providers";
import { ChatDock } from "@/components/chat/chat-dock";
import { AiAssistant } from "@/components/chat/ai-assistant";

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
        en: "/en",
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
      <body>
        <FiberNetworkBackground />
        <AppProviders>
          <a href="#main-content" className="skip-link">
            {t(locale, "skipToContent")}
          </a>
          <SiteHeader locale={locale} />
          <main id="main-content">{children}</main>
          <SiteFooter locale={locale} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
          <ChatDock locale={locale} />
          <AiAssistant locale={locale} />
        </AppProviders>
      </body>
    </html>
  );
}

