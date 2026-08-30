import { ReactNode } from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface ModernContentCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  readTime?: string;
  category?: string;
  locale: "fr" | "ar";
  children?: ReactNode;
}

export function ModernContentCard({
  title,
  excerpt,
  image,
  date,
  readTime,
  category,
  locale,
  children,
}: ModernContentCardProps) {
  const isRTL = locale === "ar";

  return (
    <div className="group relative bg-slate-800/60 backdrop-blur-md border border-yellow-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:border-yellow-500/50 hover:shadow-[0_8px_32px_rgba(212,175,55,0.2)]">
      {image && (
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"
          />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {category && (
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 text-xs font-semibold rounded-full">
                {category}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
          {date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>

        <p className="text-slate-400 mb-4 line-clamp-3">
          {excerpt}
        </p>

        {children || (
          <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
            {locale === "fr" ? "Lire la suite" : "اقرأ المزيد"}
            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
}