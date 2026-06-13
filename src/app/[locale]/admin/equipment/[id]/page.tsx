"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { defaultLocale, isLocale, localePath, t, type Locale } from "@/lib/i18n";

type Equipment = {
  id: string;
  name: string;
  manufacturer: string;
  deviceType: string;
  price: number;
  coverageRadiusM: number;
  maxUsers: number;
  imageUrl: string | null;
  isActive: boolean;
};

export default function AdminEquipmentEditPage() {
  const params = useParams();
  const router = useRouter();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const id = typeof params?.id === "string" ? params.id : "";

  const [item, setItem] = useState<Equipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/equipment", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return (await r.json()) as { equipment?: Equipment[] };
      })
      .then((data) => {
        if (cancelled) return;
        setItem(data.equipment?.find((e) => e.id === id) ?? null);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!item) return <p className="text-white/70">{error ?? t(locale, "portalProfileLoading")}</p>;

  return (
    <div className="grid gap-4 max-w-xl">
      <h1 className="text-2xl font-bold text-white">{t(locale, "adminEditEquipment")}</h1>
      <input className="input" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />
      <input className="input" value={item.manufacturer} onChange={(e) => setItem({ ...item, manufacturer: e.target.value })} />
      <select className="input" value={item.deviceType} onChange={(e) => setItem({ ...item, deviceType: e.target.value })}>
        <option value="ROUTER">Router</option>
        <option value="ACCESS_POINT">Access Point</option>
        <option value="MESH_NODE">Mesh Node</option>
      </select>
      <input className="input" type="number" value={item.price} onChange={(e) => setItem({ ...item, price: Number(e.target.value) })} />
      <input className="input" type="number" value={item.coverageRadiusM} onChange={(e) => setItem({ ...item, coverageRadiusM: Number(e.target.value) })} />
      <input className="input" type="number" value={item.maxUsers} onChange={(e) => setItem({ ...item, maxUsers: Number(e.target.value) })} />
      <input className="input" value={item.imageUrl ?? ""} onChange={(e) => setItem({ ...item, imageUrl: e.target.value || null })} />
      <label className="flex items-center gap-2 text-white/80">
        <input type="checkbox" checked={item.isActive} onChange={(e) => setItem({ ...item, isActive: e.target.checked })} />
        {t(locale, "adminActive")}
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={async () => {
            const res = await fetch(`/api/admin/equipment/${id}`, {
              method: "PUT",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(item),
            });
            if (!res.ok) setError(await res.text());
            else router.push(localePath(locale, "/admin/equipment"));
          }}
        >
          {t(locale, "portalSaveProfile")}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={async () => {
            if (!confirm("Delete this equipment?")) return;
            await fetch(`/api/admin/equipment/${id}`, { method: "DELETE" });
            router.push(localePath(locale, "/admin/equipment"));
          }}
        >
          {t(locale, "adminDelete")}
        </button>
      </div>
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
    </div>
  );
}
