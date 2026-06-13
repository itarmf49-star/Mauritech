import Link from "next/link";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <section className="container section">
      <p className="eyebrow">About MauriTech</p>
      <h1 className="h1">Infrastructure-first technology company</h1>
      <p className="muted">
        MauriTech is a technology engineering company focused on Internet distribution, Wi-Fi deployment, and network
        infrastructure in Mauritania and West Africa. We deliver residential internet, fiber optic backbones, structured
        cabling, and enterprise networking with field-proven execution standards.
      </p>
      <div className="card-grid" style={{ marginTop: "1rem" }}>
        <article className="card">
          <h2 className="h2">Who we are</h2>
          <p>A multidisciplinary deployment team covering fiber, Wi-Fi, structured cabling, and enterprise networking.</p>
        </article>
        <article className="card">
          <h2 className="h2">What we do</h2>
          <p>Design, deploy, optimize, and support critical digital infrastructure for business and public institutions.</p>
        </article>
        <article className="card">
          <h2 className="h2">Why trusted</h2>
          <p>Clear delivery governance, secure engineering baselines, and reliable long-term support commitments.</p>
        </article>
      </div>
      <p style={{ marginTop: "1rem" }}>
        <Link className="btn btn-primary btn-md" href={`/${locale}/contact`}>
          Talk to the MauriTech team
        </Link>
      </p>
    </section>
  );
}
