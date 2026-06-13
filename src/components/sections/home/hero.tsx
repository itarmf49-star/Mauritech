"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type HomeHeroProps = {
  locale: Locale;
};

export function HomeHero({ locale }: HomeHeroProps) {
  return (
    <section className="hero hero-premium">
      <Container className="hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="eyebrow">{t(locale, "heroEyebrow")}</p>
          <h1 className="h1">{t(locale, "heroHeadline")}</h1>
          <p className="lead">{t(locale, "heroSubheadline")}</p>
          <p className="muted">{t(locale, "heroTagline")}</p>
          <div className="hero-actions">
            <LinkButton href={`/${locale}/coverage`}>{t(locale, "heroCalculateCoverage")}</LinkButton>
            <LinkButton href={`/${locale}/contact?intent=consultation`} variant="ghost">
              {t(locale, "heroFreeConsultation")}
            </LinkButton>
          </div>
        </motion.div>

        <motion.div
          className="hero-glass"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          aria-hidden
        >
          <div className="hero-image-wrap">
            <Image
              src={`/images/hero-${locale}.svg`}
              alt={t(locale, "heroImageAlt")}
              width={640}
              height={360}
              style={{ width: "100%", height: "auto", borderBottom: "1px solid rgba(212, 175, 55, 0.12)" }}
              priority
            />
            <div className="hero-logo" aria-hidden>
              <div className="hero-logo-badge">
                <span className="hero-logo-mark">Mauri</span>
                <span className="hero-logo-word">Tech</span>
              </div>
            </div>
          </div>
          <div className="hero-glass-inner">
            <div className="hero-metric">
              <p className="metric-label">{t(locale, "heroMetricUptime")}</p>
              <p className="metric-value">99.9%</p>
            </div>
            <div className="hero-metric">
              <p className="metric-label">{t(locale, "heroMetricCoverage")}</p>
              <p className="metric-value">Wi-Fi 6</p>
            </div>
            <div className="hero-metric">
              <p className="metric-label">{t(locale, "heroMetricResponse")}</p>
              <p className="metric-value">&lt; 60m</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
