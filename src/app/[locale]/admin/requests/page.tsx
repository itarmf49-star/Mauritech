"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { useParams } from "next/navigation";

type ServiceRequest = {
  id: string;
  type: string;
  status: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
};

export default function AdminRequestsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const typeFilter = searchParams?.get("type") ?? "";

  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const q = typeFilter ? `?type=${typeFilter}` : "";
    const res = await fetch(`/api/admin/requests${q}`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { requests?: ServiceRequest[] };
      setItems(data.requests ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [typeFilter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold text-white">{t(locale, "adminRequests")}</h1>
      <div className="hero-actions">
        {["", "SITE_SURVEY", "INSTALLATION", "CONSULTATION"].map((type) => (
          <a key={type || "all"} href={type ? `?type=${type}` : "?"} className={["pill", typeFilter === type ? "pill-active" : ""].join(" ")}>
            {type || "All"}
          </a>
        ))}
      </div>
      {loading ? <p className="text-white/60">{t(locale, "portalProfileLoading")}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t(locale, "adminDate")}</th>
              <th>Type</th>
              <th>{t(locale, "contactFormName")}</th>
              <th>{t(locale, "contactFormPhone")}</th>
              <th>{t(locale, "adminStatus")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>{item.type}</td>
                <td>{item.name}</td>
                <td>{item.phone ?? item.email ?? "—"}</td>
                <td>{item.status}</td>
                <td>
                  <select className="input" value={item.status} onChange={(e) => void updateStatus(item.id, e.target.value)}>
                    {["NEW", "CONTACTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
