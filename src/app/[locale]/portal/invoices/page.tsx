import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { InvoicesTable } from "@/components/portal/invoices-table";
import { prisma } from "@/lib/prisma";
import type { PortalInvoiceStatus } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalInvoicesPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=/${locale}/portal/invoices`);
  }

  const invoicesRaw = await prisma.invoice.findMany({
    where: { account: { userId: session.user.id } },
    orderBy: { issuedAt: "desc" },
    include: { account: true },
  });
  const invoices = invoicesRaw.map((inv) => ({
    id: inv.id,
    date: inv.issuedAt.toISOString().slice(0, 10),
    status: (
      inv.status?.toUpperCase() === "PAID" ? "PAID" : inv.status?.toUpperCase() === "OVERDUE" ? "OVERDUE" : "PENDING"
    ) as PortalInvoiceStatus,
    amount: inv.amount,
    currency: "MRU",
  }));

  return (
    <section className="portal-page">
      <div className="portal-page-head">
        <h2 className="portal-page-title">{t(locale, "portal.invoices")}</h2>
        <p className="muted">{t(locale, "portalInvoiceHint")}</p>
      </div>
      <InvoicesTable
        invoices={invoices}
        labels={{
          filterAll: t(locale, "portalFilterAll"),
          filterPaid: t(locale, "portalFilterPaid"),
          filterPending: t(locale, "portalFilterPending"),
          filterOverdue: t(locale, "portalFilterOverdue"),
          id: t(locale, "portalInvoiceId"),
          date: t(locale, "portalInvoiceDate"),
          status: t(locale, "portal.status"),
          amount: t(locale, "portalInvoiceAmount"),
          download: t(locale, "portal.download"),
          empty: t(locale, "portal.noData"),
        }}
      />
    </section>
  );
}
