"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type Customer = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  info: string | null;
  createdAt: string;
  orders?: { total: number }[];
};

export default function AdminCustomersPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/customers", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const total = customers.length;
    const now = new Date();
    const newThisMonth = customers.filter((c) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const totalOrders = customers.reduce((sum, c) => sum + (c.orders?.length || 0), 0);
    const totalSpent = customers.reduce((sum, c) => sum + (c.orders?.reduce((s, o) => s + (o.total || 0), 0) || 0), 0);
    return { total, newThisMonth, totalOrders, totalSpent };
  }, [customers]);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminCustomersManagement")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(locale, "adminCustomersHint")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalCustomers")}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminNewThisMonth")}</p>
            <p className="text-3xl font-black text-blue-500 mt-2">{stats.newThisMonth}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalOrders")}</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{stats.totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t(locale, "adminTotalSpent")}</p>
            <p className="text-3xl font-black text-[#B8860B] mt-2">{stats.totalSpent.toLocaleString()} MRU</p>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {loading && <p className="text-gray-500 text-sm">{t(locale, "adminLoadingCustomers")}</p>}

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "orderCustomerName")}</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "orderCustomerEmail")}</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "orderCustomerPhone")}</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminOrders")}</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminTotalSpent")}</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminRegistrationDate")}</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">{t(locale, "adminActionsCol")}</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{c.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{c.orders?.length || 0}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {(c.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0).toLocaleString()} MRU
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button className="text-[#3b82f6] hover:underline text-xs font-bold" onClick={() => setSelectedCustomer(c)}>{t(locale, "adminView")}</button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && !loading && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t(locale, "adminNoCustomersYet")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t(locale, "adminCustomerDetails")}</h2>
                <button className="text-gray-500 hover:text-gray-900" onClick={() => setSelectedCustomer(null)}>✕</button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t(locale, "orderCustomerName")}</p>
                    <p className="text-gray-700 text-sm mt-1">{selectedCustomer.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t(locale, "orderCustomerEmail")}</p>
                    <p className="text-gray-700 text-sm mt-1">{selectedCustomer.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t(locale, "orderCustomerPhone")}</p>
                    <p className="text-gray-700 text-sm mt-1" dir="ltr">{selectedCustomer.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t(locale, "adminJoinDate")}</p>
                    <p className="text-gray-700 text-sm mt-1">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedCustomer.info && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t(locale, "adminNotes")}</p>
                    <p className="text-gray-700 text-sm mt-1">{selectedCustomer.info}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
