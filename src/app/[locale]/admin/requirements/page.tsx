"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Requirement = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  budget: number | null;
  deadline: string | null;
  assignedTo: string | null;
  createdAt: string;
};

const emptyForm = {
  title: "",
  description: "",
  category: "PRODUCT",
  priority: "MEDIUM",
  status: "OPEN",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  budget: "",
  deadline: "",
  assignedTo: "",
  notes: "",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "border-blue-500/25 text-blue-400 bg-blue-400/5",
  MEDIUM: "border-yellow-500/25 text-yellow-400 bg-yellow-400/5",
  HIGH: "border-orange-500/25 text-orange-400 bg-orange-400/5",
  URGENT: "border-red-500/25 text-red-600 bg-red-400/5",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "border-blue-500/25 text-blue-400 bg-blue-400/5",
  IN_PROGRESS: "border-indigo-500/25 text-indigo-400 bg-indigo-400/5",
  QUOTED: "border-purple-500/25 text-purple-400 bg-purple-400/5",
  ACCEPTED: "border-green-500/25 text-emerald-600 bg-green-400/5",
  COMPLETED: "border-emerald-500/25 text-emerald-400 bg-emerald-400/5",
  CANCELLED: "border-red-500/25 text-red-600 bg-red-400/5",
};

const PRIORITY_LABEL_KEYS: Record<string, any> = {
  LOW: "reqPriorityLow",
  MEDIUM: "reqPriorityMedium",
  HIGH: "reqPriorityHigh",
  URGENT: "reqPriorityUrgent",
};

const STATUS_LABEL_KEYS: Record<string, any> = {
  OPEN: "reqStatusOpen",
  IN_PROGRESS: "reqStatusInProgress",
  QUOTED: "reqStatusQuoted",
  ACCEPTED: "reqStatusAccepted",
  COMPLETED: "reqStatusCompleted",
  CANCELLED: "reqStatusCancelled",
};

const CATEGORY_LABEL_KEYS: Record<string, any> = {
  PRODUCT: "reqCategoryProduct",
  SERVICE: "reqCategoryService",
  SUPPORT: "reqCategorySupport",
  CONSULTATION: "reqCategoryConsultation",
  CUSTOM: "reqCategoryCustom",
};

export default function AdminRequirementsPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (statusFilter) qs.set("status", statusFilter);
      if (priorityFilter) qs.set("priority", priorityFilter);
      const res = await fetch(`/api/admin/requirements?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(t(locale, "adminSettingsError"));
      const data = await res.json();
      setRequirements(data.requirements || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    const total = requirements.length;
    const open = requirements.filter((r) => r.status === "OPEN").length;
    const inProgress = requirements.filter((r) => r.status === "IN_PROGRESS").length;
    const quoted = requirements.filter((r) => r.status === "QUOTED").length;
    const completed = requirements.filter((r) => r.status === "COMPLETED").length;
    return { total, open, inProgress, quoted, completed };
  }, [requirements]);

  function openAdd() {
    setEditingReq(null);
    setForm(emptyForm);
    setShowDialog(true);
  }

  function openEdit(req: Requirement) {
    setEditingReq(req);
    setForm({
      title: req.title,
      description: req.description || "",
      category: req.category,
      priority: req.priority,
      status: req.status,
      contactName: req.contactName || "",
      contactEmail: req.contactEmail || "",
      contactPhone: req.contactPhone || "",
      budget: req.budget?.toString() || "",
      deadline: req.deadline ? req.deadline.slice(0, 10) : "",
      assignedTo: req.assignedTo || "",
      notes: "",
    });
    setShowDialog(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        status: form.status,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        budget: form.budget ? Number(form.budget) : undefined,
        deadline: form.deadline || undefined,
        assignedTo: form.assignedTo,
      };

      let res: Response;
      if (editingReq) {
        res = await fetch(`/api/admin/requirements/${editingReq.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/requirements", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t(locale, "adminSettingsError"));
      }

      setShowDialog(false);
      setEditingReq(null);
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/requirements/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(t(locale, "adminSettingsError"));
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminRequirementsManagement")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t(locale, "adminRequirementsHint")}</p>
          </div>
          <button className="btn-light-primary" onClick={openAdd}>+ {t(locale, "adminAddRequirement")}</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalRequirements")}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "reqStatusOpen")}</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.open}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "reqStatusInProgress")}</p>
            <p className="text-3xl font-black text-indigo-400 mt-2">{stats.inProgress}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "reqStatusQuoted")}</p>
            <p className="text-3xl font-black text-purple-400 mt-2">{stats.quoted}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "reqStatusCompleted")}</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{stats.completed}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t(locale, "adminStatusLabelColon")}</span>
            {[["", t(locale, "portalFilterAll")], ...Object.entries(STATUS_LABEL_KEYS).map(([k, key]) => [k, t(locale, key)])].map(([key, label]) => (
              <button
                key={"status-" + (key || "all")}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  statusFilter === key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t(locale, "adminPriorityLabelColon")}</span>
            {[["", t(locale, "portalFilterAll")], ...Object.entries(PRIORITY_LABEL_KEYS).map(([k, key]) => [k, t(locale, key)])].map(([key, label]) => (
              <button
                key={"priority-" + (key || "all")}
                onClick={() => setPriorityFilter(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  priorityFilter === key ? "bg-[#3b82f6] text-white border-[#3b82f6]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {loading && <p className="text-gray-500">{t(locale, "adminLoadingRequirements")}</p>}

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminReqTitle")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminProductCategory")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminPriority")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminStatus")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminContactPerson")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminDate")}</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminActionsCol")}</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{r.title}</td>
                    <td className="px-4 py-3 text-gray-600">{CATEGORY_LABEL_KEYS[r.category] ? t(locale, CATEGORY_LABEL_KEYS[r.category]) : r.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${PRIORITY_COLORS[r.priority] || ""}`}>
                        {PRIORITY_LABEL_KEYS[r.priority] ? t(locale, PRIORITY_LABEL_KEYS[r.priority]) : r.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${STATUS_COLORS[r.status] || ""}`}>
                        {STATUS_LABEL_KEYS[r.status] ? t(locale, STATUS_LABEL_KEYS[r.status]) : r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.contactName || r.contactEmail || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(r)}>{t(locale, "adminEdit")}</button>
                        <select
                          className="input-light text-xs py-1 px-2"
                          value={r.status}
                          onChange={(e) => void updateStatus(r.id, e.target.value)}
                        >
                          {Object.entries(STATUS_LABEL_KEYS).map(([s, key]) => (
                            <option key={s} value={s}>{t(locale, key)}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {requirements.length === 0 && !loading && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t(locale, "adminNoRequirements")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDialog(false)}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editingReq ? t(locale, "adminEditRequirement") : t(locale, "adminAddRequirement")}</h2>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminReqTitle")}</label>
                  <input className="input-light w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminReqDescription")}</label>
                  <textarea className="input-light w-full h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminProductCategory")}</label>
                    <select className="input-light w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {Object.entries(CATEGORY_LABEL_KEYS).map(([c, key]) => (
                        <option key={c} value={c}>{t(locale, key)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminPriority")}</label>
                    <select className="input-light w-full" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                      {Object.entries(PRIORITY_LABEL_KEYS).map(([p, key]) => (
                        <option key={p} value={p}>{t(locale, key)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStatus")}</label>
                    <select className="input-light w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {Object.entries(STATUS_LABEL_KEYS).map(([s, key]) => (
                        <option key={s} value={s}>{t(locale, key)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminContactName")}</label>
                    <input className="input-light w-full" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "contactFormEmail")}</label>
                    <input className="input-light w-full" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "orderCustomerPhone")}</label>
                    <input className="input-light w-full" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminBudgetMRU")}</label>
                    <input className="input-light w-full" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminDeadline")}</label>
                    <input className="input-light w-full" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminAssignedTo")}</label>
                  <input className="input-light w-full" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-light-primary" disabled={saving}>
                    {saving ? t(locale, "adminSavingEllipsis") : editingReq ? t(locale, "adminUpdateRequirement") : t(locale, "adminCreateRequirement")}
                  </button>
                  <button type="button" className="btn-light-secondary" onClick={() => setShowDialog(false)}>{t(locale, "adminCancel")}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
