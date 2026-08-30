"use client";

import { useMemo, memo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, LogOut, User } from "lucide-react";
import { adminT, type AdminLocale } from "@/lib/admin-i18n";
import { signOut } from "next-auth/react";

interface AdminTopbarProps {
  locale: AdminLocale;
  onOpenSidebar: () => void;
}

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(fr|ar)(?=\/|$)/, "") || "/";
}

export const AdminTopbar = memo(function AdminTopbar({ locale, onOpenSidebar }: AdminTopbarProps) {
  const pathname = usePathname() ?? "/";
  const base = stripLocale(pathname);

  const title = useMemo(() => {
    if (base === "/admin") return adminT(locale, "adminOverview");
    if (base.startsWith("/admin/content")) return locale === "fr" ? "Contenu" : "المحتوى";
    if (base.startsWith("/admin/whatsapp")) return "WhatsApp";
    if (base.startsWith("/admin/inventory")) return locale === "fr" ? "Inventaire" : "المخزون";
    if (base.startsWith("/admin/customers")) return adminT(locale, "adminCustomers");
    if (base.startsWith("/admin/settings")) return adminT(locale, "adminSettings");
    if (base.startsWith("/admin/analytics")) return adminT(locale, "adminAnalytics");
    if (base.startsWith("/admin/orders")) return adminT(locale, "adminOrders");
    if (base.startsWith("/admin/shipping")) return adminT(locale, "adminShipping");
    if (base.startsWith("/admin/requests")) return adminT(locale, "adminRequests");
    return adminT(locale, "adminOverview");
  }, [base, locale]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: `/${locale}/login` });
  }, [locale]);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-amber-600 transition font-bold"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="text-gray-900 font-extrabold tracking-tight">{title}</div>
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 border-2 border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
              <span className="text-[10px] font-bold text-green-700">{adminT(locale, "adminOnline")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-amber-600 transition font-bold"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <div className="h-10 w-10 rounded-lg border-2 border-gray-200 bg-gradient-to-br from-yellow-500 to-yellow-600 grid place-items-center text-white font-extrabold shadow-md">
            <User className="h-5 w-5" />
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:inline-flex h-10 items-center justify-center gap-2 px-4 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-800 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition font-bold"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-bold">{adminT(locale, "adminLogout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
});