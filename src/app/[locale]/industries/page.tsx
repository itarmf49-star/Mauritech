import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function IndustriesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  void locale;

  const industries = ["Government", "Healthcare", "Education", "Retail", "Hospitality", "Industrial Sites"];

  return (
    <section className="container section">
      <p className="eyebrow">Industries</p>
      <h1 className="h1">Industry-ready infrastructure expertise</h1>
      <p className="muted">
        MauriTech adapts deployment and security standards to regulated, high-availability, and distributed operational
        contexts.
      </p>
      <div className="card-grid" style={{ marginTop: "1rem" }}>
        {industries.map((item) => (
          <article className="card" key={item}>
            <h2 className="h2">{item}</h2>
            <p>Architecture, deployment, and managed support tailored to business continuity requirements.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
