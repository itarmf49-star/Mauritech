"use client";

import { useEffect, useMemo, useState } from "react";
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

const TYPE_LABEL_KEYS: Record<string, any> = {
  SITE_SURVEY: "srTypeSiteSurvey",
  INSTALLATION: "srTypeInstallation",
  CONSULTATION: "srTypeConsultation",
};

const STATUS_LABEL_KEYS: Record<string, any> = {
  NEW: "srStatusNew",
  CONTACTED: "srStatusContacted",
  SCHEDULED: "srStatusScheduled",
  IN_PROGRESS: "reqStatusInProgress",
  COMPLETED: "reqStatusCompleted",
  CANCELLED: "reqStatusCancelled",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "border-[#3b82f6]/25 text-[#3b82f6] bg-[#3b82f6]/5",
  CONTACTED: "border-indigo-500/25 text-indigo-600 bg-indigo-50",
  SCHEDULED: "border-purple-500/25 text-purple-600 bg-purple-50",
  IN_PROGRESS: "border-yellow-500/25 text-yellow-600 bg-yellow-50",
  COMPLETED: "border-green-500/25 text-emerald-600 bg-green-50",
  CANCELLED: "border-red-500/25 text-red-600 bg-red-50",
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

  const stats = useMemo(() => {
    const total = items.length;
    const nw = items.filter((r) => r.status === "NEW").length;
    const inProgress = items.filter((r) => r.status === "SCHEDULED" || r.status === "IN_PROGRESS" || r.status === "CONTACTED").length;
    const completed = items.filter((r) => r.status === "COMPLETED").length;
    return { total, nw, inProgress, completed };
  }, [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminRequests")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t(locale, "adminRequestsHint")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalGeneric")}</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminNewCount")}</p>
          <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.nw}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "reqStatusInProgress")}</p>
          <p className="text-3xl font-black text-yellow-600 mt-2">{stats.inProgress}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminCompletedFem")}</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats.completed}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["", "SITE_SURVEY", "INSTALLATION", "CONSULTATION"].map((type) => (
          <a
            key={type || "all"}
            href={type ? `?type=${type}` : "?"}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
              typeFilter === type ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {type ? t(locale, TYPE_LABEL_KEYS[type]) : t(locale, "portalFilterAll")}
          </a>
        ))}
      </div>

      {loading ? <p className="text-gray-500 text-sm">{t(locale, "portalProfileLoading")}</p> : null}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminDate")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminType")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "contactFormName")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "contactFormPhone")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminStatus")}</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600">{t(locale, "adminUpdateCol")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-700">{TYPE_LABEL_KEYS[item.type] ? t(locale, TYPE_LABEL_KEYS[item.type]) : item.type}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500" dir="ltr">{item.phone ?? item.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${STATUS_COLORS[item.status] || "border-gray-200 text-gray-500 bg-white"}`}>
                      {STATUS_LABEL_KEYS[item.status] ? t(locale, STATUS_LABEL_KEYS[item.status]) : item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select className="input-light text-xs py-1.5" value={item.status} onChange={(e) => void updateStatus(item.id, e.target.value)}>
                      {Object.entries(STATUS_LABEL_KEYS).map(([s, key]) => (
                        <option key={s} value={s}>{t(locale, key)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    {t(locale, "adminNoServiceRequestsYet")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
