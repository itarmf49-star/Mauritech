import Link from "next/link";
import type { Service } from "@/types/content";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { Building2, Cable, Home, LifeBuoy, Network, Wifi } from "lucide-react";

type ServicesGridProps = {
  items: Service[];
  locale: Locale;
};

const SERVICE_I18N: Record<string, { title: string; description: string }> = {
  "residential-internet": { title: "serviceResidentialTitle", description: "serviceResidentialDesc" },
  "home-wifi": { title: "serviceHomeWifiTitle", description: "serviceHomeWifiDesc" },
  "business-networks": { title: "serviceBusinessTitle", description: "serviceBusinessDesc" },
  infrastructure: { title: "serviceInfrastructureTitle", description: "serviceInfrastructureDesc" },
  "fiber-optic": { title: "serviceFiberTitle", description: "serviceFiberDesc" },
  maintenance: { title: "serviceMaintenanceTitle", description: "serviceMaintenanceDesc" },
};

export function ServicesGrid({ items, locale }: ServicesGridProps) {
  const iconMap = {
    Home,
    Wifi,
    Building2,
    Network,
    Cable,
    LifeBuoy,
  };

  return (
    <section className="container mx-auto px-6 py-20" aria-labelledby="services-title">
      <div className="text-center mb-16">
        <h2 id="services-title" className="text-4xl font-bold text-white">
          {t(locale, "servicesTitle")}
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{t(locale, "servicesSubtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => {
          const i18n = SERVICE_I18N[item.id];
          const title = i18n ? t(locale, i18n.title) : item.title;
          const description = i18n ? t(locale, i18n.description) : item.description;
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Network;

          return (
            <Link
              key={item.id ?? i}
              href={`/${locale}${item.href}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:border-[#F5C542]/30 transition-colors"
            >
              <Icon className="h-5 w-5 text-[#F5C542]" />
              <div className="text-sm text-gray-400">#{i + 1}</div>
              <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-gray-300">{description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}