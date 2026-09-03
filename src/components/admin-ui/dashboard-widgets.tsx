"use client";

import type { ReactNode } from "react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const ICON_BG: Record<string, string> = {
  orange: "bg-[#FFF1E9] text-[#F4623A]",
  teal: "bg-[#E7F7F3] text-[#0FA37F]",
  navy: "bg-[#EEF1FF] text-[#3B4B8C]",
  yellow: "bg-[#FEF7E0] text-[#D3A314]",
};

export function KpiCard({
  label,
  value,
  trend,
  trendUp,
  icon,
  color,
  sparkline,
}: {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
  color: keyof typeof ICON_BG;
  sparkline?: number[];
}) {
  const sparkData = (sparkline ?? []).map((v, i) => ({ i, v }));
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[13px] font-medium text-gray-500">{label}</p>
        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${ICON_BG[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center justify-between mt-2">
        <p className={`text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trendUp ? "↗" : "↘"} {trend}
        </p>
        {sparkData.length > 1 && (
          <div className="w-16 h-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area type="monotone" dataKey="v" stroke={trendUp ? "#10B981" : "#EF4444"} fill="transparent" strokeWidth={1.75} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export function RevenueChart({ data, currency }: { data: { label: string; value: number }[]; currency: string }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F4623A" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#F4623A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={50} />
          <Tooltip formatter={((v: any) => [`${Number(v).toLocaleString()} ${currency}`, ""]) as any} contentStyle={{ borderRadius: 8, border: "1px solid #eee", fontSize: 12 }} />
          <Area type="monotone" dataKey="value" stroke="#F4623A" strokeWidth={2} fill="url(#revFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#D3A314",
  CONFIRMED: "#3B4B8C",
  PROCESSING: "#8B5FBF",
  SHIPPED: "#0FA37F",
  DELIVERED: "#10B981",
  CANCELLED: "#9CA3AF",
  REFUNDED: "#EF4444",
};

export function StatusDonut({ data, total }: { data: { status: string; label: string; count: number }[]; total: number }) {
  const filtered = data.filter((d) => d.count > 0);
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={filtered} dataKey="count" nameKey="label" innerRadius={45} outerRadius={70} paddingAngle={2}>
              {filtered.map((d) => (
                <Cell key={d.status} fill={STATUS_COLORS[d.status] || "#9CA3AF"} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-gray-900">{total}</span>
        </div>
      </div>
      <div className="w-full mt-4 space-y-2">
        {filtered.map((d) => (
          <div key={d.status} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[d.status] || "#9CA3AF" }} />
              {d.label}
            </span>
            <span className="font-semibold text-gray-900">{total > 0 ? Math.round((d.count / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GoalBar({ label, percent, current, target, color = "#F4623A" }: { label: string; percent: number; current: string; target: string; color?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-semibold text-gray-800">{label}</span>
        <span className="text-[13px] font-bold text-gray-900">{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, percent)}%`, background: color }} />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-gray-400">{current}</span>
        <span className="text-[11px] text-gray-400">{target}</span>
      </div>
    </div>
  );
}
