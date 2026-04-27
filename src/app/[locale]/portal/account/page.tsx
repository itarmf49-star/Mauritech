import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PortalAccountAuditPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalAccountAuditPage({ params }: PortalAccountAuditPageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? "";
  const email = session?.user?.email ?? null;

  const [user, invoiceCount, messageCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, phone: true, info: true },
    }),
    prisma.invoice.count({ where: { account: { userId } } }),
    prisma.message.count({ where: { userId } }),
  ]);

  return (
    <section className="portal-page">
      <div className="portal-page-head">
        <h2 className="portal-page-title">{t(locale, "portal.account")}</h2>
        <p className="muted">{t(locale, "portalAccountDescription")}</p>
      </div>

      <div className="portal-grid-3">
        <div className="portal-card">
          <p className="portal-card-kicker">{t(locale, "portalAccountEmail")}</p>
          <strong className="portal-card-big">{email ?? t(locale, "portalNotAvailable")}</strong>
        </div>
        <div className="portal-card">
          <p className="portal-card-kicker">{t(locale, "portalAccountStatus")}</p>
          <strong className="portal-card-big">{user ? "ACTIVE" : "LIMITED"}</strong>
        </div>
        <div className="portal-card">
          <p className="portal-card-kicker">{t(locale, "portalTotalInvoices")}</p>
          <strong className="portal-card-big">{invoiceCount}</strong>
        </div>
      </div>

      <div className="portal-grid-2">
        <div className="portal-card">
          <h3 className="portal-card-title">{t(locale, "portalManageAccount")}</h3>
          <p className="muted">{t(locale, "portalChangePasswordHint")}</p>
          <div className="portal-actions" style={{ marginTop: "0.75rem" }}>
            <Link className="btn btn-primary btn-md" href={`/${locale}/portal/settings`}>
              {t(locale, "portal.settings")}
            </Link>
          </div>
        </div>
        <div className="portal-card">
          <h3 className="portal-card-title">{t(locale, "portal.messages")}</h3>
          <p className="muted">
            {t(locale, "portalMessagesToAdmin")}: {messageCount}
          </p>
        </div>
      </div>
      <div className="portal-card">
        <h3 className="portal-card-title">Profile details</h3>
        <p className="muted">Phone: {user?.phone ?? "-"}</p>
        <p className="muted">Notes: {user?.info ?? "-"}</p>
      </div>
    </section>
  );
}
