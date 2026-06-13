import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/content";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.id }));
}

const SERVICE_I18N: Record<string, { title: string; description: string }> = {
  "residential-internet": { title: "serviceResidentialTitle", description: "serviceResidentialDesc" },
  "home-wifi": { title: "serviceHomeWifiTitle", description: "serviceHomeWifiDesc" },
  "business-networks": { title: "serviceBusinessTitle", description: "serviceBusinessDesc" },
  infrastructure: { title: "serviceInfrastructureTitle", description: "serviceInfrastructureDesc" },
  "fiber-optic": { title: "serviceFiberTitle", description: "serviceFiberDesc" },
  maintenance: { title: "serviceMaintenanceTitle", description: "serviceMaintenanceDesc" },
};

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ServiceLandingPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const service = services.find((s) => s.id === slug);
  if (!service) notFound();

  const i18n = SERVICE_I18N[service.id];
  const title = i18n ? t(locale, i18n.title) : service.title;
  const description = i18n ? t(locale, i18n.description) : service.description;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    provider: { "@type": "Organization", name: "MauriTech", url: "https://mauritech.tech" },
    areaServed: "Mauritania",
  };

  return (
    <section className="container section">
      <p className="eyebrow">{t(locale, "navServices")}</p>
      <h1 className="h1">{title}</h1>
      <p className="lead">{description}</p>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h2 className="h2">{t(locale, "howItWorksTitle")}</h2>
        <ol className="muted" style={{ marginTop: "0.75rem", lineHeight: 1.8 }}>
          <li>{t(locale, "step1Title")} — {t(locale, "step1Description")}</li>
          <li>{t(locale, "step2Title")} — {t(locale, "step2Description")}</li>
          <li>{t(locale, "step3Title")} — {t(locale, "step3Description")}</li>
          <li>{t(locale, "step4Title")} — {t(locale, "step4Description")}</li>
        </ol>
      </div>

      <div className="hero-actions" style={{ marginTop: "1.5rem" }}>
        <Link className="btn btn-primary" href={`/${locale}/coverage`}>{t(locale, "heroCalculateCoverage")}</Link>
        <Link className="btn btn-ghost" href={`/${locale}/contact?intent=consultation&service=${slug}`}>{t(locale, "heroFreeConsultation")}</Link>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
