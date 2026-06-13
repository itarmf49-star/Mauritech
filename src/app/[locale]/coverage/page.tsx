"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button, LinkButton } from "@/components/ui/button";
import { NetworkDesignViewer } from "@/components/coverage/network-design-viewer";
import type { CoverageResult } from "@/lib/coverage-types";
import { defaultLocale, coverageQualityLabel, isLocale, t, type Locale } from "@/lib/i18n";

export default function CoverageCalculatorPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const { status } = useSession();

  const [area, setArea] = useState(220);
  const [rooms, setRooms] = useState(6);
  const [floors, setFloors] = useState(2);
  const [wallType, setWallType] = useState<"standard" | "reinforced_concrete">("standard");
  const [speed, setSpeed] = useState(100);
  const [devices, setDevices] = useState(12);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoverageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSent, setLeadSent] = useState(false);

  async function calculate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coverage/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          areaSqm: area,
          rooms,
          floors,
          wallType,
          desiredSpeedMbps: speed,
          deviceCount: devices,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { estimate: CoverageResult };
      setResult(data.estimate);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function savePlan() {
    if (!result) return;
    setSaveState(null);
    const res = await fetch("/api/coverage/plans", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        areaSqm: area,
        floors,
        wallLossDb: result.wallLossDb,
        rooms,
        wallType,
        desiredSpeedMbps: speed,
        deviceCount: devices,
        recommendedAps: result.recommendedAps,
        recommendedSwitches: result.recommendedSwitches,
        recommendedOutlets: result.recommendedOutlets,
        floorPlanJson: result.floorPlans,
        recommendationsJson: result.equipment,
        equipmentCost: result.equipmentCost,
        installCost: result.installCost,
        totalCost: result.totalCost,
        coverageQuality: result.coverageQuality,
      }),
    });
    setSaveState(res.ok ? t(locale, "coverageSaved") : t(locale, "coverageCouldNotSave"));
  }

  async function submitConsultation() {
    if (!result) return;
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "CONSULTATION",
        name: leadName,
        phone: leadPhone,
        notes: `Coverage estimate: ${result.recommendedAps} APs, total ${result.totalCost} MRU`,
        metadata: result,
      }),
    });
    setLeadSent(res.ok);
  }

  return (
    <section className="section">
      <Container>
        <h1 className="h1">{t(locale, "coverageTitle")}</h1>
        <p className="muted">{t(locale, "coverageDescription")}</p>

        <div className="auth-card" style={{ marginTop: "1rem" }}>
          <div className="auth-form">
            <label className="field">
              <span className="field-label">{t(locale, "coverageIndoorArea")}</span>
              <input className="input" type="number" min={20} max={20000} value={area} onChange={(e) => setArea(Number(e.target.value))} />
            </label>
            <label className="field">
              <span className="field-label">{t(locale, "coverageRooms")}</span>
              <input className="input" type="number" min={1} max={100} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} />
            </label>
            <label className="field">
              <span className="field-label">{t(locale, "coverageFloors")}</span>
              <input className="input" type="number" min={1} max={40} value={floors} onChange={(e) => setFloors(Number(e.target.value))} />
            </label>
            <label className="field">
              <span className="field-label">{t(locale, "coverageWallType")}</span>
              <select className="input" value={wallType} onChange={(e) => setWallType(e.target.value as "standard" | "reinforced_concrete")}>
                <option value="standard">{t(locale, "coverageWallStandard")}</option>
                <option value="reinforced_concrete">{t(locale, "coverageWallConcrete")}</option>
              </select>
            </label>
            <label className="field">
              <span className="field-label">{t(locale, "coverageDesiredSpeed")}</span>
              <input className="input" type="number" min={10} max={10000} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            </label>
            <label className="field">
              <span className="field-label">{t(locale, "coverageDeviceCount")}</span>
              <input className="input" type="number" min={1} max={500} value={devices} onChange={(e) => setDevices(Number(e.target.value))} />
            </label>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <Button type="button" onClick={() => void calculate()} disabled={loading}>
              {loading ? t(locale, "coverageCalculating") : t(locale, "coverageCalculate")}
            </Button>
          </div>
          {error ? <p className="muted" style={{ marginTop: "0.5rem", color: "#f87171" }}>{error}</p> : null}
        </div>

        {result ? (
          <div className="grid gap-4" style={{ marginTop: "1rem" }}>
            <NetworkDesignViewer locale={locale} floorPlans={result.floorPlans} quality={result.coverageQuality} />

            <div className="auth-card">
              <p className="field-label">{t(locale, "coverageResultsTitle")}</p>
              <ul className="muted" style={{ marginTop: "0.5rem", lineHeight: 1.8 }}>
                <li>{t(locale, "coverageAps")}: <strong style={{ color: "#F5C542" }}>{result.recommendedAps}</strong></li>
                <li>{t(locale, "coverageSwitches")}: <strong style={{ color: "#33B8FF" }}>{result.recommendedSwitches}</strong></li>
                <li>{t(locale, "coverageOutlets")}: {result.recommendedOutlets}</li>
                <li>{t(locale, "coverageQuality")}: {coverageQualityLabel(locale, result.coverageQuality)}</li>
                <li>{t(locale, "coverageEquipmentCost")}: {result.equipmentCost.toLocaleString()} {result.currency}</li>
                <li>{t(locale, "coverageInstallCost")}: {result.installCost.toLocaleString()} {result.currency}</li>
                <li>{t(locale, "coverageTotalCost")}: <strong style={{ color: "#F5C542" }}>{result.totalCost.toLocaleString()} {result.currency}</strong></li>
              </ul>

              <div className="admin-table-wrap" style={{ marginTop: "0.75rem" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t(locale, "adminTitle")}</th>
                      <th>{t(locale, "adminManufacturer")}</th>
                      <th>Qty</th>
                      <th>{t(locale, "adminBasePrice")}</th>
                      <th>{t(locale, "adminTotal")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.equipment.map((line) => (
                      <tr key={line.equipmentId}>
                        <td>{line.name}</td>
                        <td>{line.manufacturer}</td>
                        <td>{line.quantity}</td>
                        <td>{line.unitPrice.toLocaleString()}</td>
                        <td>{line.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
                <Button type="button" onClick={() => window.print()}>{t(locale, "coverageExportPrint")}</Button>
                {status === "authenticated" ? (
                  <Button type="button" variant="ghost" onClick={() => void savePlan()}>{t(locale, "coverageSavePlan")}</Button>
                ) : (
                  <LinkButton href={`/${locale}/login?next=/${locale}/coverage`} variant="ghost">{t(locale, "coverageSignInSave")}</LinkButton>
                )}
              </div>
              {saveState ? <p className="muted" style={{ marginTop: "0.5rem" }}>{saveState}</p> : null}
            </div>

            <div className="auth-card">
              <p className="field-label">{t(locale, "heroFreeConsultation")}</p>
              <div className="auth-form" style={{ marginTop: "0.5rem" }}>
                <input className="input" placeholder={t(locale, "contactFormName")} value={leadName} onChange={(e) => setLeadName(e.target.value)} />
                <input className="input" placeholder={t(locale, "contactFormPhone")} value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} />
              </div>
              <Button type="button" style={{ marginTop: "0.75rem" }} onClick={() => void submitConsultation()} disabled={!leadName || leadSent}>
                {leadSent ? t(locale, "coverageRequestSent") : t(locale, "heroFreeConsultation")}
              </Button>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
