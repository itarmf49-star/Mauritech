"use client";

import { useState } from "react";
import type { CoverageResult, FloorPlan } from "@/lib/coverage-types";
import { coverageQualityLabel, type Locale, t } from "@/lib/i18n";

type FloorPlanViewerProps = {
  locale: Locale;
  floorPlans: FloorPlan[];
  quality: CoverageResult["coverageQuality"];
};

export function FloorPlanViewer({ locale, floorPlans, quality }: FloorPlanViewerProps) {
  const [floor, setFloor] = useState(0);
  const plan = floorPlans[floor] ?? floorPlans[0];
  if (!plan) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <p className="field-label">{t(locale, "coverageFloorPlan")}</p>
        <div className="flex gap-2 flex-wrap">
          {floorPlans.map((_, i) => (
            <button
              key={i}
              type="button"
              className={["pill", floor === i ? "pill-active" : ""].join(" ")}
              onClick={() => setFloor(i)}
            >
              {t(locale, "coverageFloor")} {i + 1}
            </button>
          ))}
        </div>
        <span className={["pill", quality === "excellent" ? "pill-active" : ""].join(" ")}>
          {coverageQualityLabel(locale, quality)}
        </span>
      </div>
      <svg viewBox={`0 0 ${plan.width} ${plan.height}`} className="w-full h-auto rounded-xl bg-[#0B0F14]" role="img" aria-label={t(locale, "coverageFloorPlan")}>
        <defs>
          <radialGradient id="apGlow">
            <stop offset="0%" stopColor="#33B8FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#33B8FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {plan.rooms.map((room) => (
          <g key={room.id}>
            <rect x={room.x} y={room.y} width={room.width} height={room.height} fill="rgba(255,255,255,0.04)" stroke="rgba(212,175,55,0.35)" strokeWidth="1.5" rx="4" />
            <text x={room.x + room.width / 2} y={room.y + room.height / 2} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
              {room.label}
            </text>
          </g>
        ))}
        {plan.aps.map((ap) => (
          <g key={ap.id}>
            <circle cx={ap.x} cy={ap.y} r={ap.radius} fill="url(#apGlow)" />
            <circle cx={ap.x} cy={ap.y} r={6} fill="#F5C542" stroke="#33B8FF" strokeWidth="1.5" />
            <title>{ap.equipmentName}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
