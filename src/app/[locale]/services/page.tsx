import Link from "next/link";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { services } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Organization", name: "MauriTech", url: "https://mauritech.tech" },
    serviceType: services.map((service) => service.title).join(", "),
    areaServed: ["Mauritania", "West Africa"],
  };

  return (
    <section className="container section">
      <p className="eyebrow">Services</p>
      <h1 className="h1">End-to-end infrastructure services</h1>
      <p className="muted">From architecture to support, MauriTech deploys secure, scalable systems for modern operations.</p>
      <div className="card-grid" style={{ marginTop: "1rem" }}>
        {services.map((service) => (
          <article id={service.href.split("#")[1]} className="card" key={service.id}>
            <p className="eyebrow">{service.icon}</p>
            <h2 className="h2">{service.title}</h2>
            <p>{service.description}</p>
            <Link className="inline-link" href={`/${locale}/contact`}>
              Request consultation
            </Link>
          </article>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
    </section>
  );
}
