import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Monorepo: parent folder may contain another lockfile; pin the app root for Turbopack/Vercel.
  turbopack: {
    root: appDir,
  },
  poweredByHeader: false,
  compress: true,
  // يمنع استيراد حزمة الأيقونات/الرسوم البيانية كاملة في كل صفحة تستخدم أيقونة أو
  // رسماً بيانياً واحداً فقط — يقلّل حجم الـ JS المُحمَّل لكل تنقّل بشكل ملموس.
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
