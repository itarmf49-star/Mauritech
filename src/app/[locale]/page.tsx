import { AnnouncementTicker } from "@/components/sections/home/announcement-ticker";
import { ContactCta } from "@/components/sections/home/contact-cta";
import { CoverageCta } from "@/components/sections/home/coverage-cta";
import { HomeHero } from "@/components/sections/home/hero";
import { HowItWorks } from "@/components/sections/home/how-it-works";
import { TrustStrip } from "@/components/sections/home/trust-strip";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { ServicesGrid } from "@/components/sections/services-grid";
import StoreFront from "@/components/shop/StoreFront";

import { networkingProjects, services } from "@/lib/content";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";


type HomePageProps = {
  params: Promise<{ locale: string }>;
};


export default async function HomePage({ params }: HomePageProps) {

  const { locale: raw } = await params;

  const locale: Locale = isLocale(raw)
    ? raw
    : defaultLocale;



  const tickerItemsByLocale: Record<Locale, string[]> = {

    en: [
      "Internet distribution and connectivity solutions",
      "Professional Wi-Fi deployment across Mauritania",
      "Fiber optic and structured cabling installation",
      "Enterprise and government network infrastructure",
    ],


    fr: [
      "Solutions de distribution Internet et connectivite",
      "Deploiement Wi-Fi professionnel en Mauritanie",
      "Installation fibre optique et cablage structure",
      "Infrastructure reseau entreprise et institutions",
    ],


    ar: [
      "حلول توزيع الإنترنت والاتصال",
      "نشر واي فاي احترافي في موريتانيا",
      "تركيب الألياف البصرية والكابلات الهيكلية",
      "بنية تحتية للشبكات المؤسسية والحكومية",
    ],

  };



  return (

    <>

      <AnnouncementTicker
        items={tickerItemsByLocale[locale]}
        ariaLabel={t(locale, "announcementsAriaLabel")}
      />


      <HomeHero locale={locale} />


      <TrustStrip locale={locale} />


      <ServicesGrid
        items={services}
        locale={locale}
      />


      {/* Mauritech Store */}

      <StoreFront />



      <CoverageCta locale={locale} />



      <ProjectsGrid
        items={networkingProjects}
        locale={locale}
      />


      <HowItWorks locale={locale} />


      <ContactCta locale={locale} />


    </>

  );

}
