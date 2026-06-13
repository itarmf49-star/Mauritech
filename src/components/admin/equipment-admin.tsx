"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n";

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

export function EquipmentAdmin({ locale }: { locale: Locale }) {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    deviceType: "ACCESS_POINT",
    price: 0,
    coverageRadiusM: 12,
    maxUsers: 32,
    imageUrl: "",
    isActive: true,
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/equipment", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { equipment?: Equipment[] };
      setItems(data.equipment ?? []);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    const res = await fetch("/api/admin/equipment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        imageUrl: form.imageUrl || null,
      }),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setForm({ name: "", manufacturer: "", deviceType: "ACCESS_POINT", price: 0, coverageRadiusM: 12, maxUsers: 32, imageUrl: "", isActive: true });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t(locale, "adminEquipment")}</h1>
        <p className="text-white/60 text-sm mt-1">{t(locale, "adminEquipmentHint")}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 grid gap-3 md:grid-cols-2">
        <input className="input" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Manufacturer" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} />
        <select className="input" value={form.deviceType} onChange={(e) => setForm({ ...form, deviceType: e.target.value })}>
          <option value="ROUTER">Router</option>
          <option value="ACCESS_POINT">Access Point</option>
          <option value="MESH_NODE">Mesh Node</option>
        </select>
        <input className="input" type="number" placeholder="Price (MRU)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input className="input" type="number" placeholder="Coverage radius (m)" value={form.coverageRadiusM} onChange={(e) => setForm({ ...form, coverageRadiusM: Number(e.target.value) })} />
        <input className="input" type="number" placeholder="Max users" value={form.maxUsers} onChange={(e) => setForm({ ...form, maxUsers: Number(e.target.value) })} />
        <input className="input md:col-span-2" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <button type="button" className="btn btn-primary" onClick={() => void create()}>
          {t(locale, "adminAddEquipment")}
        </button>
      </div>

      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
      {loading ? <p className="text-white/60">{t(locale, "portalProfileLoading")}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t(locale, "adminTitle")}</th>
              <th>{t(locale, "adminManufacturer")}</th>
              <th>{t(locale, "adminDeviceType")}</th>
              <th>{t(locale, "adminBasePrice")}</th>
              <th>{t(locale, "adminCoverageRadius")}</th>
              <th>{t(locale, "adminMaxUsers")}</th>
              <th>{t(locale, "adminActive")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.manufacturer}</td>
                <td>{item.deviceType}</td>
                <td>{item.price} MRU</td>
                <td>{item.coverageRadiusM}m</td>
                <td>{item.maxUsers}</td>
                <td>{item.isActive ? t(locale, "adminYes") : t(locale, "adminNo")}</td>
                <td>
                  <Link href={localePath(locale, `/admin/equipment/${item.id}`)} className="inline-link">
                    {t(locale, "adminEdit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
