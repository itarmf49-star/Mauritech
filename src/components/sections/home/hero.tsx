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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">
            {t(locale, "heroEyebrow")}
          </p>

          <h1 className="h1">
            {t(locale, "heroHeadline")}
          </h1>

          <p className="lead">
            {t(locale, "heroSubheadline")}
          </p>

          <div className="hero-actions">
            <LinkButton
              href={`/${locale}/contact`}
            >
              {t(locale, "heroPrimaryCta" as any)}
            </LinkButton>

            <LinkButton
              href={`/${locale}/projects`}
              variant="ghost"
            >
              {t(locale, "heroSecondaryCta")}
            </LinkButton>
          </div>

          <div className="hero-highlights">
            <span>Network Infrastructure</span>
            <span>Fiber Optics</span>
            <span>Smart Systems</span>
            <span>Security Solutions</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hero-visual"
        >
          <Image
            src="/images/hero-network.webp"
            alt={t(locale, "heroImageAlt")}
            width={900}
            height={700}
            priority
          />
        </motion.div>
      </Container>
    </section>
  );
}
