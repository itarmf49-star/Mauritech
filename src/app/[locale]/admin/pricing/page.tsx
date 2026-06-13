"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type PricingRow = {
  id: string;
  name: string;
  unit: string;
  basePrice: number;
  currency: string;
  isActive: boolean;
};

export default function AdminPricingPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [items, setItems] = useState<PricingRow[]>([]);
  const [form, setForm] = useState({ name: "", unit: "ap", basePrice: 0, currency: "MRU", isActive: true });

  async function load() {
    const res = await fetch("/api/admin/pricing", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { pricing?: PricingRow[] };
      setItems(data.pricing ?? []);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    await fetch("/api/admin/pricing", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", unit: "ap", basePrice: 0, currency: "MRU", isActive: true });
    await load();
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold text-white">{t(locale, "adminPricing")}</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 grid gap-3 md:grid-cols-2">
        <input className="input" placeholder="Rule name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
          <option value="ap">Per AP</option>
          <option value="router">Per router</option>
          <option value="outlet">Per outlet</option>
          <option value="sqm">Per m²</option>
          <option value="hour">Per hour</option>
        </select>
        <input className="input" type="number" placeholder="Base price" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
        <button type="button" className="btn btn-primary" onClick={() => void create()}>Add pricing rule</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t(locale, "adminTitle")}</th>
              <th>Unit</th>
              <th>{t(locale, "adminBasePrice")}</th>
              <th>{t(locale, "adminActive")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>{item.basePrice} {item.currency}</td>
                <td>{item.isActive ? t(locale, "adminYes") : t(locale, "adminNo")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
