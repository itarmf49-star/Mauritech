"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
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
  URGENT: "border-red-500/25 text-red-400 bg-red-400/5",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "border-blue-500/25 text-blue-400 bg-blue-400/5",
  IN_PROGRESS: "border-indigo-500/25 text-indigo-400 bg-indigo-400/5",
  QUOTED: "border-purple-500/25 text-purple-400 bg-purple-400/5",
  ACCEPTED: "border-green-500/25 text-green-400 bg-green-400/5",
  COMPLETED: "border-emerald-500/25 text-emerald-400 bg-emerald-400/5",
  CANCELLED: "border-red-500/25 text-red-400 bg-red-400/5",
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

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = statusFilter ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/requirements${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load requirements");
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
  }, [statusFilter]);

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
        throw new Error(err.error || "Failed to save requirement");
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
      if (!res.ok) throw new Error("Failed to update status");
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">إدارة المتطلبات</h1>
            <p className="text-white/50 text-sm mt-1">تتبع متطلبات العملاء والطلبات.</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ إضافة متطلب</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">إجمالي المتطلبات</p>
            <p className="text-3xl font-black text-white mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">مفتوح</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{stats.open}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">قيد التنفيذ</p>
            <p className="text-3xl font-black text-indigo-400 mt-2">{stats.inProgress}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">مقدر</p>
            <p className="text-3xl font-black text-purple-400 mt-2">{stats.quoted}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">مكتمل</p>
            <p className="text-3xl font-black text-green-400 mt-2">{stats.completed}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">جميع الحالات</option>
            <option value="OPEN">مفتوح</option>
            <option value="IN_PROGRESS">قيد التنفيذ</option>
            <option value="QUOTED">مقدر</option>
            <option value="ACCEPTED">مقبول</option>
            <option value="COMPLETED">مكتمل</option>
            <option value="CANCELLED">ملغى</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-white/60">جارٍ تحميل المتطلبات...</p>}

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-bold text-white/70">العنوان</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">الفئة</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">الأولوية</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">الحالة</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">جهة الاتصال</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">التاريخ</th>
                  <th className="px-4 py-3 text-left font-bold text-white/70">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white/90 font-medium">{r.title}</td>
                    <td className="px-4 py-3 text-white/70">{r.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${PRIORITY_COLORS[r.priority] || ""}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium ${STATUS_COLORS[r.status] || ""}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/70">
                      {r.contactName || r.contactEmail || "-"}
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(r)}>تعديل</button>
                        <select
                          className="input text-xs py-1 px-2"
                          value={r.status}
                          onChange={(e) => void updateStatus(r.id, e.target.value)}
                        >
                          {["OPEN", "IN_PROGRESS", "QUOTED", "ACCEPTED", "COMPLETED", "CANCELLED"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {requirements.length === 0 && !loading && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-white/40">لا توجد متطلبات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDialog(false)}>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">{editingReq ? "تعديل متطلب" : "إضافة متطلب"}</h2>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">العنوان</label>
                  <input className="input w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">الوصف</label>
                  <textarea className="input w-full h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">الفئة</label>
                    <select className="input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {["PRODUCT", "SERVICE", "SUPPORT", "CONSULTATION", "CUSTOM"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">الأولوية</label>
                    <select className="input w-full" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                      {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">الحالة</label>
                    <select className="input w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {["OPEN", "IN_PROGRESS", "QUOTED", "ACCEPTED", "COMPLETED", "CANCELLED"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">اسم جهة الاتصال</label>
                    <input className="input w-full" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">البريد الإلكتروني</label>
                    <input className="input w-full" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">الهاتف</label>
                    <input className="input w-full" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">الميزانية (MRU)</label>
                    <input className="input w-full" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-1">الموعد النهائي</label>
                    <input className="input w-full" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1">معين إلى</label>
                  <input className="input w-full" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "جارٍ الحفظ..." : editingReq ? "تحديث المتطلب" : "إنشاء متطلب"}
                  </button>
                  <button type="button" className="btn" onClick={() => setShowDialog(false)}>إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
