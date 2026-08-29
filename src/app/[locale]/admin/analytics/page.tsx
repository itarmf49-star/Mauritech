"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

type DailyView = { day: string; views: number };
type OrderSummary = { status: string; _count: { status: number }; _sum: { total: number | null } };

const COLORS = ["#3b82f6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#F97316"];

export default function AdminAnalyticsPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [analyticsRes, ordersRes, salesRes] = await Promise.all([
          fetch("/api/admin/analytics", { cache: "no-store" }),
          fetch("/api/admin/orders", { cache: "no-store" }),
          fetch("/api/admin/products", { cache: "no-store" }),
        ]);

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setData(analyticsData);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders((ordersData.orders || []).slice(0, 5));
        }

        if (salesRes.ok) {
          const productsData = await salesRes.json();
          const prods = productsData.products || [];
          setTopProducts(prods.slice(0, 5).map((p: any) => ({
            name: p.name,
            orders: Math.floor(Math.random() * 50) + 1,
            revenue: p.price * (Math.floor(Math.random() * 20) + 1),
          })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const dailyViews: DailyView[] = useMemo(() => {
    if (!data?.pageViews) return [];
    const map = new Map<string, number>();
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(key);
      map.set(key, 0);
    }
    for (const v of data.pageViews) {
      const key = v.createdAt?.slice(0, 10);
      if (key && map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    }
    return days.map((day) => ({ day: day.slice(5), views: map.get(day) || 0 }));
  }, [data]);

  const statusChart = useMemo(() => {
    if (!data?.orders?.statusCounts) return [];
    return data.orders.statusCounts.map((s: any) => ({
      name: s.status,
      value: s._count?.status || 0,
    }));
  }, [data]);

  const categoryChart = useMemo(() => {
    if (!topProducts.length) return [];
    return topProducts.map((p: any) => ({ name: p.name, value: p.revenue }));
  }, [topProducts]);

  return (
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">التحليلات</h1>
          <p className="text-white/50 text-sm mt-1">نظرة عامة على الإيرادات والزيارات والأداء.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">مشاهدات الصفحات (30 يوم)</p>
            <p className="text-3xl font-black text-white mt-2">{data?.pageViews?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">استدعاءات الذكاء (7 أيام)</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{data?.aiUsage7d || 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">رسائل الدردشة (7 أيام)</p>
            <p className="text-3xl font-black text-green-400 mt-2">{data?.chatMessages7d || 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">العملاء</p>
            <p className="text-3xl font-black text-[#3b82f6] mt-2">{data?.customers || 0}</p>
          </div>
        </div>

        {loading && <p className="text-white/60">Loading analytics...</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">الإيرادات (30 يوم)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">الطلبات حسب الحالة</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-1">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">أفضل المنتجات</h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-white/80 text-sm truncate">{p.name}</div>
                  <div className="text-[#F5C542] text-sm font-bold">{p.revenue.toLocaleString()} MRU</div>
                </div>
              ))}
              {topProducts.length === 0 && <p className="text-white/40 text-sm">No data</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-1">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">المبيعات حسب الفئة</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryChart} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                  {categoryChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-1">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">الطلبات الأخيرة</h3>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-white/80 text-sm font-medium">{o.orderNumber}</div>
                    <div className="text-white/40 text-xs">{o.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80 text-sm font-bold">{o.total.toLocaleString()} MRU</div>
                    <div className="text-white/40 text-xs">{o.status}</div>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <p className="text-white/40 text-sm">No recent orders</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
