"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { defaultLocale, coverageQualityLabel, isLocale, t, type Locale } from "@/lib/i18n";

type SavedPlan = {
  id: string;
  areaSqm: number;
  floors: number;
  rooms: number | null;
  recommendedAps: number;
  totalCost: number | null;
  coverageQuality: string | null;
  createdAt: string;
};

export default function PortalCoveragePage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/coverage/plans");
      if (cancelled) return;
      if (!res.ok) {
        setError(t(locale, "coverageCouldNotSave"));
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { plans?: SavedPlan[] };
      setPlans(data.plans ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <section className="portal-dashboard">
      <div className="portal-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="portal-card-title">{t(locale, "portalCoveragePlans")}</h1>
            <p className="muted">{t(locale, "coverageDescription")}</p>
          </div>
          <LinkButton href={`/${locale}/coverage`}>{t(locale, "portalNewCalculator")}</LinkButton>
        </div>
      </div>

      {loading ? <p className="muted">{t(locale, "portalProfileLoading")}</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}

      {!loading && plans.length === 0 ? (
        <div className="portal-card">
          <p className="muted">{t(locale, "portalNoDataHint")}</p>
          <LinkButton href={`/${locale}/coverage`}>{t(locale, "coverageCalculate")}</LinkButton>
        </div>
      ) : null}

      {!loading && plans.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t(locale, "coverageIndoorArea")}</th>
                <th>{t(locale, "coverageRooms")}</th>
                <th>{t(locale, "coverageFloors")}</th>
                <th>{t(locale, "coverageAps")}</th>
                <th>{t(locale, "coverageQuality")}</th>
                <th>{t(locale, "coverageTotalCost")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.areaSqm} m²</td>
                  <td>{plan.rooms ?? "—"}</td>
                  <td>{plan.floors}</td>
                  <td>{plan.recommendedAps}</td>
                  <td>
                    {plan.coverageQuality
                      ? coverageQualityLabel(locale, plan.coverageQuality as "excellent" | "good" | "fair")
                      : "—"}
                  </td>
                  <td>{plan.totalCost != null ? `${plan.totalCost.toLocaleString()} MRU` : "—"}</td>
                  <td>
                    <Link className="inline-link" href={`/${locale}/coverage`}>
                      {t(locale, "portalViewPlan")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
