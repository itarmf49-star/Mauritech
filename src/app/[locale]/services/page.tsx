import Link from "next/link";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { services } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

const SERVICE_I18N: Record<string, { title: string; description: string }> = {
  "residential-internet": { title: "serviceResidentialTitle", description: "serviceResidentialDesc" },
  "home-wifi": { title: "serviceHomeWifiTitle", description: "serviceHomeWifiDesc" },
  "business-networks": { title: "serviceBusinessTitle", description: "serviceBusinessDesc" },
  infrastructure: { title: "serviceInfrastructureTitle", description: "serviceInfrastructureDesc" },
  "fiber-optic": { title: "serviceFiberTitle", description: "serviceFiberDesc" },
  maintenance: { title: "serviceMaintenanceTitle", description: "serviceMaintenanceDesc" },
};

export default async function ServicesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Organization", name: "MauriTech", url: "https://mauritech.tech" },
    serviceType: services.map((service) => t(locale, SERVICE_I18N[service.id]?.title ?? "servicesTitle")).join(", "),
    areaServed: ["Mauritania"],
  };

  return (
    <section className="container section">
      <p className="eyebrow">{t(locale, "navServices")}</p>
      <h1 className="h1">{t(locale, "servicesTitle")}</h1>
      <p className="muted">{t(locale, "servicesSubtitle")}</p>
      <div className="card-grid" style={{ marginTop: "1rem" }}>
        {services.map((service) => {
          const i18n = SERVICE_I18N[service.id];
          return (
            <article className="card" key={service.id}>
              <p className="eyebrow">{service.icon}</p>
              <h2 className="h2">{i18n ? t(locale, i18n.title) : service.title}</h2>
              <p>{i18n ? t(locale, i18n.description) : service.description}</p>
              <Link className="inline-link" href={`/${locale}/services/${service.id}`}>
                {t(locale, "heroFreeConsultation")}
              </Link>
            </article>
          );
        })}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
    </section>
  );
}
