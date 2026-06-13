"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type ServiceRequestRow = {
  id: string;
  type: string;
  status: string;
  name: string;
  notes: string | null;
  createdAt: string;
};

export default function PortalRequestsPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [requests, setRequests] = useState<ServiceRequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/portal/requests");
      if (cancelled) return;
      if (res.ok) {
        const data = (await res.json()) as { requests?: ServiceRequestRow[] };
        setRequests(data.requests ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="portal-dashboard">
      <div className="portal-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="portal-card-title">{t(locale, "portalServiceRequests")}</h1>
            <p className="muted">{t(locale, "portalServiceRequestsHint")}</p>
          </div>
          <LinkButton href={`/${locale}/coverage`}>{t(locale, "heroFreeConsultation")}</LinkButton>
        </div>
      </div>

      {loading ? <p className="muted">{t(locale, "portalProfileLoading")}</p> : null}

      {!loading && requests.length === 0 ? (
        <div className="portal-card">
          <p className="muted">{t(locale, "portalNoDataHint")}</p>
        </div>
      ) : null}

      {!loading && requests.length > 0 ? (
        <ul className="portal-list">
          {requests.map((req) => (
            <li key={req.id} className="portal-list-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <span className="portal-list-main">
                {req.type.replace(/_/g, " ")} · {req.status}
              </span>
              <span className="muted text-sm">{new Date(req.createdAt).toLocaleString()}</span>
              {req.notes ? <span className="muted text-sm">{req.notes}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
