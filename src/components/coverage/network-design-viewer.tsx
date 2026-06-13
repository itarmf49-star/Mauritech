"use client";

import { useMemo, useState } from "react";
import type { CoverageResult, FloorPlan } from "@/lib/coverage-types";
import { coverageQualityLabel, type Locale, t } from "@/lib/i18n";

type NetworkDesignViewerProps = {
  locale: Locale;
  floorPlans: FloorPlan[];
  quality: CoverageResult["coverageQuality"];
};

function heatColor(strength: number) {
  if (strength >= 0.75) return `rgba(51, 184, 255, ${0.35 + strength * 0.25})`;
  if (strength >= 0.45) return `rgba(245, 197, 66, ${0.2 + strength * 0.2})`;
  if (strength >= 0.15) return `rgba(255, 120, 80, ${0.15 + strength * 0.15})`;
  return "transparent";
}

function roomFill(kind: FloorPlan["rooms"][0]["kind"]) {
  switch (kind) {
    case "tech":
      return "rgba(245, 197, 66, 0.12)";
    case "storage":
      return "rgba(212, 175, 55, 0.08)";
    case "hallway":
      return "rgba(255, 255, 255, 0.03)";
    default:
      return "rgba(255, 255, 255, 0.05)";
  }
}

function DeviceIcon({ device, index }: { device: FloorPlan["devices"][0]; index: number }) {
  const { x, y, deviceType } = device;

  if (deviceType === "ROUTER") {
    return (
      <g transform={`translate(${x - 14}, ${y - 14})`}>
        <rect width="28" height="20" rx="4" fill="#1a2332" stroke="#F5C542" strokeWidth="1.5" />
        <line x1="14" y1="0" x2="14" y2="-8" stroke="#33B8FF" strokeWidth="2" />
        <circle cx="14" cy="-8" r="2" fill="#33B8FF" />
        <text x="14" y="14" textAnchor="middle" fill="#F5C542" fontSize="7" fontWeight="700">
          RTR
        </text>
      </g>
    );
  }

  if (deviceType === "SWITCH") {
    return (
      <g transform={`translate(${x - 12}, ${y - 8})`}>
        <rect width="24" height="14" rx="2" fill="#142235" stroke="rgba(51,184,255,0.6)" strokeWidth="1" />
        <text x="12" y="10" textAnchor="middle" fill="#33B8FF" fontSize="6">
          SW
        </text>
      </g>
    );
  }

  const isMesh = deviceType === "MESH_NODE";
  const color = isMesh ? "#F5C542" : "#33B8FF";

  return (
    <g>
      <circle cx={x} cy={y} r={device.radius} fill="none" stroke={color} strokeWidth="1" opacity="0.15">
        <animate attributeName="r" values={`${device.radius * 0.6};${device.radius};${device.radius * 0.6}`} dur="3s" repeatCount="indefinite" begin={`${index * 0.4}s`} />
        <animate attributeName="opacity" values="0.08;0.22;0.08" dur="3s" repeatCount="indefinite" begin={`${index * 0.4}s`} />
      </circle>
      <circle cx={x} cy={y} r={device.radius * 0.55} fill="none" stroke={color} strokeWidth="1.5" opacity="0.35">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.2s" repeatCount="indefinite" begin={`${index * 0.3}s`} />
      </circle>
      <circle cx={x} cy={y} r={isMesh ? 7 : 8} fill={isMesh ? "#2a2418" : "#0f2840"} stroke={color} strokeWidth="2" />
      <path
        d={`M ${x - 6} ${y + 2} Q ${x} ${y - 6} ${x + 6} ${y + 2}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.9"
      />
      <path
        d={`M ${x - 4} ${y + 4} Q ${x} ${y - 2} ${x + 4} ${y + 4}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />
    </g>
  );
}

function FloorSvg({ plan }: { plan: FloorPlan }) {
  const cellW = plan.width / plan.heatmap.cols;
  const cellH = plan.height / plan.heatmap.rows;

  return (
    <svg viewBox={`0 0 ${plan.width} ${plan.height}`} className="w-full h-auto rounded-xl bg-[#0B0F14]" role="img">
      <defs>
        <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={plan.width} height={plan.height} fill="url(#grid)" />

      {plan.heatmap.values.map((v, i) => {
        if (v < 0.12) return null;
        const col = i % plan.heatmap.cols;
        const row = Math.floor(i / plan.heatmap.cols);
        return (
          <rect
            key={`h-${i}`}
            x={col * cellW}
            y={row * cellH}
            width={cellW + 0.5}
            height={cellH + 0.5}
            fill={heatColor(v)}
          />
        );
      })}

      {plan.rooms.map((room) => (
        <g key={room.id}>
          <rect
            x={room.x}
            y={room.y}
            width={room.width}
            height={room.height}
            fill={roomFill(room.kind)}
            stroke={room.kind === "tech" ? "rgba(245,197,66,0.55)" : "rgba(212,175,55,0.28)"}
            strokeWidth={room.kind === "hallway" ? 1 : 1.5}
            rx={room.kind === "hallway" ? 2 : 4}
          />
          {room.label ? (
            <text
              x={room.x + room.width / 2}
              y={room.y + room.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize={room.kind === "tech" ? 11 : 10}
              fontWeight={room.kind === "tech" ? 700 : 400}
            >
              {room.label}
            </text>
          ) : null}
        </g>
      ))}

      {plan.cables.map((cable) => (
        <polyline
          key={cable.id}
          points={cable.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#33B8FF"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.65"
        />
      ))}

      {plan.devices
        .filter((d) => d.deviceType === "ACCESS_POINT" || d.deviceType === "MESH_NODE")
        .map((d, i) => (
          <DeviceIcon key={d.id} device={d} index={i} />
        ))}

      {plan.devices
        .filter((d) => d.deviceType === "ROUTER" || d.deviceType === "SWITCH")
        .map((d, i) => (
          <DeviceIcon key={d.id} device={d} index={i + 10} />
        ))}
    </svg>
  );
}

export function NetworkDesignViewer({ locale, floorPlans, quality }: NetworkDesignViewerProps) {
  const [floor, setFloor] = useState(0);
  const plan = floorPlans[floor] ?? floorPlans[0];

  const legend = useMemo(
    () => [
      { color: "rgba(51, 184, 255, 0.7)", label: t(locale, "coverageSignalStrong") },
      { color: "rgba(245, 197, 66, 0.7)", label: t(locale, "coverageSignalMedium") },
      { color: "rgba(255, 120, 80, 0.6)", label: t(locale, "coverageSignalWeak") },
    ],
    [locale],
  );

  if (!plan) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <p className="field-label">{t(locale, "coverageNetworkDesign")}</p>
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
        <FloorSvg plan={plan} />
      </div>

      <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-4 content-start">
        <div>
          <p className="field-label">{t(locale, "coveragePreviewTitle")}</p>
          <p className="muted text-sm mt-1">{t(locale, "coveragePreviewDescription")}</p>
        </div>
        <div>
          <p className="eyebrow text-xs mb-2">{t(locale, "coverageHeatmapLegend")}</p>
          <ul className="grid gap-2">
            {legend.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm text-white/75">
                <span className="h-3 w-8 rounded-sm shrink-0" style={{ background: item.color }} />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-xs mb-2">{t(locale, "coverageLegendDevices")}</p>
          <ul className="grid gap-1 text-sm text-white/70">
            <li>● {t(locale, "coverageLegendRouter")}</li>
            <li>● {t(locale, "coverageLegendAp")}</li>
            <li>● {t(locale, "coverageLegendMesh")}</li>
            <li>● {t(locale, "coverageLegendCabling")}</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
