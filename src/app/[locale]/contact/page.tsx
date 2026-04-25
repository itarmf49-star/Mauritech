import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  void locale;

  return (
    <section className="container section">
      <p className="eyebrow">Contact MauriTech</p>
      <h1 className="h1">Let us design your next infrastructure deployment</h1>
      <div className="card-grid" style={{ marginTop: "1rem" }}>
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
            <a className="inline-link" href="https://mauritech.tech">
              mauritech.tech
            </a>
          </p>
          <p>
            Phone:{" "}
            <a className="inline-link" href="tel:+22247774141">
              +222 47 77 41 41
            </a>
          </p>
        </article>
        <article className="card">
          <h2 className="h2">Support availability</h2>
          <p>Office hours: {siteConfig.officeHours}</p>
          <p>Availability: {siteConfig.availability}</p>
          <p>Response time: {siteConfig.responseTime}</p>
          <p>Support promise: Critical incidents are triaged immediately with clear communication windows.</p>
        </article>
      </div>
      <div className="hero-actions" style={{ marginTop: "1rem" }}>
        <a className="btn btn-primary btn-md" href={`mailto:${siteConfig.email}`}>
          Send email
        </a>
        <a className="btn btn-ghost btn-md" href="tel:+22247774141">
          Call now
        </a>
      </div>
    </section>
  );
}
