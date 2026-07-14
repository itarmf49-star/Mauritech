import { HomeHero } from "@/components/sections/home/hero";
import { TrustStrip } from "@/components/sections/home/trust-strip";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { ContactCta } from "@/components/sections/home/contact-cta";

import { networkingProjects, services } from "@/lib/content";
import {
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n";

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

  return (
    <>
      <HomeHero locale={locale} />

      <TrustStrip locale={locale} />

      <ServicesGrid
        items={services}
        locale={locale}
      />

      <ProjectsGrid
        items={networkingProjects}
        locale={locale}
      />

      <ContactCta locale={locale} />
    </>
  );
}
