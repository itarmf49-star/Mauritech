import { notFound } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id },
      include: {
        clientAccounts: { include: { invoices: { take: 10, orderBy: { issuedAt: "desc" } } } },
        coveragePlans: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    user = null;
  }

  if (!user) notFound();

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold text-white">{user.name ?? user.email}</h1>
      <p className="text-white/60">{user.email} · {user.role}</p>
      {user.phone ? <p className="text-white/70">{user.phone}</p> : null}

      <div className="card">
        <h2 className="h2">{t(locale, "coverageYourSavedPlans")}</h2>
        {user.coveragePlans.length === 0 ? (
          <p className="muted">{t(locale, "portalNoData")}</p>
        ) : (
          <ul className="muted" style={{ marginTop: "0.5rem" }}>
            {user.coveragePlans.map((p) => (
              <li key={p.id}>
                {p.areaSqm} m² · {p.floors} floors · {p.recommendedAps} APs · {p.totalCost ? `${p.totalCost} MRU` : "—"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
