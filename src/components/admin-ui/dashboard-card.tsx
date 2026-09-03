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
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] text-gray-500 font-medium">{title}</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
          {sub ? <div className="mt-1 text-xs text-gray-400 font-medium">{sub}</div> : null}
        </div>

        {icon ? (
          <div className="h-11 w-11 rounded-full bg-[#FFF1E9] flex items-center justify-center text-[#F4623A] shrink-0">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
