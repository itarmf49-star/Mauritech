"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GlassCard } from "@/components/glass-card";
import { LinkButton } from "@/components/ui/button";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type HomeHeroProps = {
  locale: Locale;
};

export function HomeHero({ locale }: HomeHeroProps) {
  const highlights = ["Network Infrastructure", "Fiber Optics", "Smart Systems", "Security Solutions"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <GlassCard className="p-8 border border-white/20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6"
              >
                {t(locale, "heroEyebrow")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                {t(locale, "heroHeadline")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-slate-300 leading-relaxed"
              >
                {t(locale, "heroSubheadline")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <LinkButton
                  href={`/${locale}/contact`}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  {t(locale, "heroPrimaryCta" as any)}
                </LinkButton>

                <LinkButton
                  href={`/${locale}/projects`}
                  variant="ghost"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold backdrop-blur-md transition-all duration-300"
                >
                  {t(locale, "heroSecondaryCta" as any)}
                </LinkButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3 pt-4"
              >
                {highlights.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <GlassCard glow className="p-4">
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src="/images/hero-en.svg"
                  alt={t(locale, "heroImageAlt")}
                  width={900}
                  height={700}
                  priority
                  className="w-full h-auto"
                />
                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-50" />
              </div>
            </GlassCard>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-white rounded-lg" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-white rounded-md" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}