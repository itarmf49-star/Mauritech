"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Network, Cable, LayoutGrid, ArrowRight } from "lucide-react";
import { t, type Locale } from "@/lib/i18n";
import type { Project, Localized } from "@/types/content";

// دالة مساعدة قوية لاستخراج النصوص
function getTxt(obj: Localized | string | undefined, locale: string): string {
  if (!obj) return "";
  return typeof obj === "string" ? obj : (obj[locale] || obj["fr"] || "");
}

// خريطة الأيقونات - يمكنك إضافتها في ملف منفصل لاحقاً
const ICONS: Record<string, React.ReactNode> = {
  all: <LayoutGrid size={16} />,
  networking: <Network size={16} />,
  wifi: <Wifi size={16} />,
  fiber: <Cable size={16} />,
};

export function ProjectsGrid({ items, locale }: { items: Project[]; locale: Locale }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = ["all", "networking", "wifi", "fiber"];

  const filtered = useMemo(() => {
    return activeFilter === "all" 
      ? items 
      : items.filter((p) => getTxt(p.category, locale).toLowerCase().includes(activeFilter));
  }, [items, activeFilter, locale]);

  return (
    <section className="container section">
      {/* رأس القسم مع الفلاتر */}
      <div className="flex flex-col gap-4 mb-10">
        <h2 className="text-3xl font-bold">{t(locale, "projectsTitle")}</h2>
        
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeFilter === f ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {ICONS[f]}
              <span className="capitalize">{f}</span>
            </button>
          ))}
        </div>
      </div>

      {/* شبكة المشاريع الاحترافية */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.article
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* حاوية الصورة - جاهزة للروابط من لوحة التحكم */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={project.image || "/images/placeholder.jpg"}
                  alt={getTxt(project.title, locale)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* تفاصيل المشروع */}
              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {getTxt(project.category, locale)}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-3">{getTxt(project.title, locale)}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{getTxt(project.summary, locale)}</p>
                
                <Link 
                  href={`/${locale}/projects/${project.slug}`} 
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  {t(locale, "projectViewDetails")} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
