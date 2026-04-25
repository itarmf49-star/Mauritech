import Link from "next/link";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function PortalAccessPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <section className="container section">
      <p className="eyebrow">Client Portal</p>
      <h1 className="h1">A complete customer interface for delivery visibility</h1>
      <p className="muted">
        Track projects, invoices, support, and communication in one place through the MauriTech portal experience.
      </p>
      <div className="card-grid" style={{ marginTop: "1rem" }}>
        <article className="card">
          <h2 className="h2">Track projects</h2>
          <p>Project milestones, deployment updates, and progress timeline snapshots.</p>
        </article>
        <article className="card">
          <h2 className="h2">View invoices</h2>
          <p>Billing status, downloadable invoices, and payment tracking in one dashboard.</p>
        </article>
        <article className="card">
          <h2 className="h2">Request support</h2>
          <p>Send and follow support requests with a persistent communication thread.</p>
        </article>
        <article className="card">
          <h2 className="h2">Customer dashboard</h2>
          <p>Single control point for account activity, messages, and service interactions.</p>
        </article>
      </div>
      <div className="hero-actions" style={{ marginTop: "1rem" }}>
        <Link className="btn btn-primary btn-md" href={`/${locale}/login?next=/${locale}/portal`}>
          Portal login
        </Link>
        <Link className="btn btn-ghost btn-md" href={`/${locale}/portal`}>
          Open dashboard
        </Link>
      </div>
    </section>
  );
}
