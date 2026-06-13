"use client";

import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type CoverageCtaProps = {
  locale: Locale;
};

export function CoverageCta({ locale }: CoverageCtaProps) {
  return (
    <section className="container mx-auto px-6 py-16" aria-labelledby="coverage-cta-title">
      <motion.div
        className="rounded-2xl border border-[#F5C542]/25 bg-gradient-to-br from-[#F5C542]/10 via-transparent to-[#33B8FF]/10 p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="eyebrow">{t(locale, "coverageCtaEyebrow")}</p>
        <h2 id="coverage-cta-title" className="h2 mt-2">
          {t(locale, "coverageCtaTitle")}
        </h2>
        <p className="muted mt-3 max-w-2xl mx-auto">{t(locale, "coverageCtaDescription")}</p>
        <div className="hero-actions justify-center mt-6">
          <LinkButton href={`/${locale}/coverage`}>{t(locale, "heroCalculateCoverage")}</LinkButton>
          <LinkButton href={`/${locale}/contact?intent=consultation`} variant="ghost">
            {t(locale, "heroFreeConsultation")}
          </LinkButton>
        </div>
      </motion.div>
    </section>
  );
}
