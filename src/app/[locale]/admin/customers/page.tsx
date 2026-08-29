"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
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
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">إدارة العملاء</h1>
          <p className="text-white/50 text-sm mt-1">إدارة بيانات العملاء والتواصل معهم.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Total Customers</p>
            <p className="text-3xl font-black text-white mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">New This Month</p>
            <p className="text-3xl font-black text-blue-400 mt-2">{stats.newThisMonth}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-black text-green-400 mt-2">{stats.totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Total Spent</p>
            <p className="text-3xl font-black text-[#F5C542] mt-2">{stats.totalSpent.toLocaleString()} MRU</p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-white/60">Loading customers...</p>}

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left font-bold text-white/70">الاسم</th>
              <th className="px-4 py-3 text-left font-bold text-white/70">البريد الإلكتروني</th>
              <th className="px-4 py-3 text-left font-bold text-white/70">الهاتف</th>
              <th className="px-4 py-3 text-left font-bold text-white/70">الطلبات</th>
              <th className="px-4 py-3 text-left font-bold text-white/70">إجمالي الإنفاق</th>
              <th className="px-4 py-3 text-left font-bold text-white/70">تاريخ التسجيل</th>
              <th className="px-4 py-3 text-left font-bold text-white/70">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white/90 font-medium">{c.name || "-"}</td>
                    <td className="px-4 py-3 text-white/70">{c.email || "-"}</td>
                    <td className="px-4 py-3 text-white/70">{c.phone || "-"}</td>
                    <td className="px-4 py-3 text-white/80">{c.orders?.length || 0}</td>
                    <td className="px-4 py-3 text-white/80">
                      {(c.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0).toLocaleString()} MRU
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button className="text-[#F5C542] hover:underline text-xs" onClick={() => setSelectedCustomer(c)}>View</button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && !loading && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-white/40">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Customer Details</h2>
                <button className="text-white/60 hover:text-white" onClick={() => setSelectedCustomer(null)}>✕</button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Name</p>
                    <p className="text-white/80 text-sm mt-1">{selectedCustomer.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Email</p>
                    <p className="text-white/80 text-sm mt-1">{selectedCustomer.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Phone</p>
                    <p className="text-white/80 text-sm mt-1">{selectedCustomer.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Joined</p>
                    <p className="text-white/80 text-sm mt-1">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedCustomer.info && (
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Notes</p>
                    <p className="text-white/80 text-sm mt-1">{selectedCustomer.info}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
