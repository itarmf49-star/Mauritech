"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/admin-ui/image-upload";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type StoreUserRow = {
  role: "OWNER" | "MANAGER" | "STAFF";
  user: { id: number; name: string | null; email: string };
};

type StoreRow = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  currency: string;
  isActive: boolean;
  _count: { products: number; orders: number };
  storeUsers: StoreUserRow[];
};

const emptyForm = {
  nameFr: "",
  nameAr: "",
  slug: "",
  descriptionFr: "",
  descriptionAr: "",
  logoUrl: "",
  bannerUrl: "",
  currency: "MRU",
  isActive: true,
};

export default function AdminStoresPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [stores, setStores] = useState<StoreRow[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<StoreRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [managerEmail, setManagerEmail] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [managerRole, setManagerRole] = useState<"OWNER" | "MANAGER" | "STAFF">("MANAGER");
  const [managerSaving, setManagerSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stores", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load stores");
      const data = await res.json();
      setStores(data.stores || []);
      setIsSuperAdmin(!!data.isSuperAdmin);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowDialog(true);
  }

  function openEdit(store: StoreRow) {
    setEditing(store);
    setForm({
      nameFr: store.nameFr,
      nameAr: store.nameAr,
      slug: store.slug,
      descriptionFr: store.descriptionFr || "",
      descriptionAr: store.descriptionAr || "",
      logoUrl: store.logoUrl || "",
      bannerUrl: store.bannerUrl || "",
      currency: store.currency,
      isActive: store.isActive,
    });
    setShowDialog(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      let res: Response;
      if (editing) {
        res = await fetch(`/api/admin/stores/${editing.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/stores", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save store");
      }
      setShowDialog(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/stores/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete store");
      return;
    }
    setDeleteConfirm(null);
    await load();
  }

  async function handleAddManager() {
    if (!editing || !managerEmail.trim()) return;
    setManagerSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stores/${editing.id}/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: managerEmail.trim(), name: managerName.trim(), password: managerPassword, role: managerRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add manager");
      setManagerEmail("");
      setManagerName("");
      setManagerPassword("");
      await load();
      const refreshed = (await (await fetch("/api/admin/stores", { cache: "no-store" })).json()).stores as StoreRow[];
      const updated = refreshed.find((s) => s.id === editing.id);
      if (updated) setEditing(updated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setManagerSaving(false);
    }
  }

  async function handleRemoveManager(userId: number) {
    if (!editing) return;
    const res = await fetch(`/api/admin/stores/${editing.id}/users?userId=${userId}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      const refreshed = (await (await fetch("/api/admin/stores", { cache: "no-store" })).json()).stores as StoreRow[];
      const updated = refreshed.find((s) => s.id === editing.id);
      if (updated) setEditing(updated);
    }
  }

  const roleLabel = (role: string) =>
    role === "OWNER" ? t(locale, "adminStoreRoleOwner") : role === "MANAGER" ? t(locale, "adminStoreRoleManager") : t(locale, "adminStoreRoleStaff");

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminStores")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t(locale, "adminStoresHint")}</p>
          </div>
          {isSuperAdmin && (
            <button className="btn-light-primary" onClick={openAdd}>{t(locale, "adminAddStore")}</button>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
        )}
        {loading && <p className="text-gray-500">{t(locale, "adminLoading")}</p>}

        {!loading && stores.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
            {t(locale, "adminNoStores")}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((s) => (
            <div key={s.id} className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {s.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logoUrl} alt={locale === "ar" ? s.nameAr : s.nameFr} className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="text-gray-900/30 text-xs">{(locale === "ar" ? s.nameAr : s.nameFr).slice(0, 2)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{locale === "ar" ? s.nameAr : s.nameFr}</p>
                  <p className="text-gray-400 text-xs truncate">{s.slug}</p>
                </div>
                <span className={`ms-auto inline-flex px-2 py-1 rounded-lg border text-xs font-medium shrink-0 ${
                  s.isActive ? "border-[#F5C542]/25 text-[#F5C542] bg-[#F5C542]/5" : "border-gray-200 text-gray-500 bg-gray-50"
                }`}>
                  {s.isActive ? t(locale, "adminStatusActive") : t(locale, "adminStatusInactive")}
                </span>
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                <span>{t(locale, "adminStoreProducts")}: <b className="text-gray-900">{s._count.products}</b></span>
                <span>{t(locale, "adminStoreOrders")}: <b className="text-gray-900">{s._count.orders}</b></span>
              </div>

              <div className="flex flex-wrap gap-1">
                {s.storeUsers.map((su) => (
                  <span key={su.user.id} className="text-[11px] px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-500">
                    {su.user.name || su.user.email} · {roleLabel(su.role)}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-1">
                <button className="text-[#3b82f6] hover:underline text-xs" onClick={() => openEdit(s)}>{t(locale, "adminEdit")}</button>
                {isSuperAdmin && (
                  <button className="text-red-600 hover:underline text-xs" onClick={() => setDeleteConfirm(s.id)}>{t(locale, "adminDelete")}</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowDialog(false)}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? t(locale, "adminEdit") : t(locale, "adminAddStore")}</h2>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreNameFr")}</label>
                    <input className="input-light w-full" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreNameAr")}</label>
                    <input className="input-light w-full" dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreSlug")}</label>
                  <input className="input-light w-full" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={form.nameFr} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreDescFr")}</label>
                    <textarea className="input-light w-full h-20" value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreDescAr")}</label>
                    <textarea className="input-light w-full h-20" dir="rtl" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUpload
                    folder="store-logos"
                    label={t(locale, "adminStoreLogo")}
                    value={form.logoUrl}
                    onChange={(logoUrl) => setForm({ ...form, logoUrl })}
                    fit="contain"
                    locale={locale}
                  />
                  <ImageUpload
                    folder="store-banners"
                    label={t(locale, "adminStoreBanner")}
                    value={form.bannerUrl}
                    onChange={(bannerUrl) => setForm({ ...form, bannerUrl })}
                    aspect="wide"
                    fit="contain"
                    locale={locale}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t(locale, "adminStoreCurrency")}</label>
                    <input className="input-light w-full" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
                  </div>
                  <label className="flex items-center gap-2 text-gray-700 text-sm self-end pb-2">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    {t(locale, "adminStatusActive")}
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-light-primary" disabled={saving}>
                    {saving ? t(locale, "adminLoading") : t(locale, "adminSave")}
                  </button>
                  <button type="button" className="btn-light-secondary" onClick={() => setShowDialog(false)}>{t(locale, "adminCancel")}</button>
                </div>
              </form>

              {editing && isSuperAdmin && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">{t(locale, "adminStoreManagers")}</h3>
                  <div className="space-y-2 mb-4">
                    {editing.storeUsers.map((su) => (
                      <div key={su.user.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        <span className="text-gray-700">{su.user.name || su.user.email} <span className="text-gray-400">({su.user.email})</span> · {roleLabel(su.role)}</span>
                        <button className="text-red-600 hover:underline text-xs" onClick={() => handleRemoveManager(su.user.id)}>{t(locale, "adminDelete")}</button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="input-light" placeholder={t(locale, "adminStoreManagerEmail")} value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} />
                    <input className="input-light" placeholder={t(locale, "adminStoreManagerName")} value={managerName} onChange={(e) => setManagerName(e.target.value)} />
                    <input className="input-light" type="password" placeholder={t(locale, "adminStoreManagerPassword")} value={managerPassword} onChange={(e) => setManagerPassword(e.target.value)} />
                    <select className="input-light" value={managerRole} onChange={(e) => setManagerRole(e.target.value as any)}>
                      <option value="OWNER">{t(locale, "adminStoreRoleOwner")}</option>
                      <option value="MANAGER">{t(locale, "adminStoreRoleManager")}</option>
                      <option value="STAFF">{t(locale, "adminStoreRoleStaff")}</option>
                    </select>
                  </div>
                  <button className="btn-light-primary mt-3" disabled={managerSaving} onClick={handleAddManager}>
                    {managerSaving ? t(locale, "adminLoading") : t(locale, "adminStoreAddManager")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t(locale, "adminDelete")}</h3>
              <p className="text-gray-500 text-sm mb-4">{t(locale, "adminConfirm")}?</p>
              <div className="flex gap-3">
                <button className="btn-light-primary bg-red-600 hover:bg-red-700" onClick={() => handleDelete(deleteConfirm)}>{t(locale, "adminDelete")}</button>
                <button className="btn-light-secondary" onClick={() => setDeleteConfirm(null)}>{t(locale, "adminCancel")}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
