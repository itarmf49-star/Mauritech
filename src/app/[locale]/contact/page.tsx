import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/lib/content";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <section className="container section">
      <p className="eyebrow">Contact MauriTech</p>
      <h1 className="h1">{t(locale, "contactFormTitle")}</h1>
      <p className="muted">{siteConfig.description}</p>

      <div className="card-grid" style={{ marginTop: "1.25rem", alignItems: "start", gap: "1rem" }}>
        <article className="card">
          <h2 className="h2">Company info</h2>
          <p>
            Email:{" "}
            <a className="inline-link" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </p>
          <p>
            Website:{" "}
            <a className="inline-link" href={siteConfig.siteUrl}>
              mauritech.tech
            </a>
          </p>
          <p>
            Phone:{" "}
            <a className="inline-link" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
              {siteConfig.phone}
            </a>
          </p>
        </article>
        <article className="card">
          <h2 className="h2">Support availability</h2>
          <p>Office hours: {siteConfig.officeHours}</p>
          <p>Availability: {siteConfig.availability}</p>
          <p>Response time: {siteConfig.responseTime}</p>
        </article>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <ContactForm locale={locale} />
      </div>

      <div className="hero-actions" style={{ marginTop: "2rem" }}>
        <a className="btn btn-primary btn-md" href={`mailto:${siteConfig.email}`}>
          Send email
        </a>
        <a className="btn btn-ghost btn-md" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
          Call now
        </a>
      </div>
    </section>
  );
}
