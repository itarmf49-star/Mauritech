import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/content";
import { defaultLocale, HOW_IT_WORKS_STEPS, isLocale, t, type Locale } from "@/lib/i18n";
import { getServiceI18n, SERVICE_IDS } from "@/lib/service-i18n";

export function generateStaticParams() {
  return SERVICE_IDS.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ServiceLandingPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const service = services.find((s) => s.id === slug);
  if (!service) notFound();

  const i18n = getServiceI18n(service.id);
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
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li key={step.title}>
              {t(locale, step.title)} — {t(locale, step.description)}
            </li>
          ))}
        </ol>
      </div>

      <div className="hero-actions" style={{ marginTop: "1.5rem" }}>
        <Link className="btn btn-primary" href={`/${locale}/coverage`}>
          {t(locale, "heroCalculateCoverage")}
        </Link>
        <Link className="btn btn-ghost" href={`/${locale}/contact?intent=consultation&service=${slug}`}>
          {t(locale, "heroFreeConsultation")}
        </Link>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
