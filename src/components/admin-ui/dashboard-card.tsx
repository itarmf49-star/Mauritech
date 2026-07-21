"use client";

import type { ReactNode } from "react";

export function DashboardCard({
  title,
  value,
  icon,
  sub,
}: {
  title: string;
  value: string;
  icon?: ReactNode;
  sub?: string;
}) {
  return (
    <div className="relative group overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)]">
      
      {/* تأثير لمعان خفيف يظهر عند تمرير الفأرة */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <div className="text-sm text-white/50 font-bold uppercase tracking-wider">{title}</div>
          <div className="mt-3 text-4xl font-black tracking-tight text-white drop-shadow-lg">{value}</div>
          {sub ? <div className="mt-2 text-xs text-white/40 font-medium">{sub}</div> : null}
        </div>
        
        {icon ? (
          <div className="h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#F5C542] shadow-inner group-hover:bg-white/[0.1] transition-colors">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
