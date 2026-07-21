"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, MessageSquare, Receipt, Users, 
  Settings, X, Router, BarChart3, ClipboardList, DollarSign,
} from "lucide-react";
import { localePath, t, type Locale } from "@/lib/i18n";

// مكون أيقونة احترافي
const NavIcon = ({ Icon, active }: { Icon: any; active: boolean }) => (
  <div className={`p-1.5 rounded-lg transition-all duration-300 border ${
    active ? "bg-[#F5C542]/10 border-[#F5C542]/30 shadow-[0_0_10px_rgba(245,197,66,0.1)]" : "bg-white/5 border-white/5"
  }`}>
    <Icon className={`h-5 w-5 ${active ? "text-[#F5C542]" : "text-white/60"}`} strokeWidth={2} />
  </div>
);

export function AdminSidebar({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const pathname = usePathname() ?? "/";
  
  const items = [
    { key: "dashboard", href: localePath(locale, "/admin"), label: t(locale, "adminOverview"), Icon: LayoutDashboard },
    { key: "projects", href: localePath(locale, "/admin/projects"), label: t(locale, "adminProjects"), Icon: FolderKanban },
    { key: "requests", href: localePath(locale, "/admin/requests"), label: t(locale, "adminRequests"), Icon: ClipboardList },
    { key: "messages", href: localePath(locale, "/admin/messages"), label: t(locale, "adminMessages"), Icon: MessageSquare },
    { key: "invoices", href: localePath(locale, "/admin/invoices"), label: t(locale, "adminInvoices"), Icon: Receipt },
    { key: "equipment", href: localePath(locale, "/admin/equipment"), label: t(locale, "adminEquipment"), Icon: Router },
    { key: "pricing", href: localePath(locale, "/admin/pricing"), label: t(locale, "adminPricing"), Icon: DollarSign },
    { key: "customers", href: localePath(locale, "/admin/customers"), label: t(locale, "adminCustomers"), Icon: Users },
    { key: "analytics", href: localePath(locale, "/admin/analytics"), label: t(locale, "adminAnalytics"), Icon: BarChart3 },
    { key: "settings", href: localePath(locale, "/admin/settings"), label: t(locale, "adminSettings"), Icon: Settings },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className={`fixed md:sticky top-0 left-0 z-50 h-dvh w-[280px] bg-[#0B0F14] border-r border-white/10 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
      {/* الهيدر */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-[#0B0F14]">
        <div className="text-xl font-bold tracking-tighter">
          <span className="text-white">Mauri</span><span className="text-[#F5C542]">Tech</span>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Control Center</div>
        </div>
      </div>

      {/* الروابط */}
      <nav className="p-4 grid gap-1.5flex-1">
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link key={it.key} href={it.href} className={`flex items-center gap-4 rounded-xl px-3 py-3 font-medium transition-all duration-300 ${
              active ? "bg-[#1C2128] border border-[#F5C542]/20 text-white shadow-lg" : "text-white/50 hover:text-white hover:bg-white/5"
            }`}>
              <NavIcon Icon={it.Icon} active={active} />
              <span className="text-[14px]">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* التذييل المستقل */}
<div className="mt-auto p-4 border-t border-white/5 bg-[#0B0F14]">
  <Link 
    href={`/${locale}/admin/studio`} 
    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#F5C542]/10 to-transparent border border-[#F5C542]/20 text-[#F5C542] hover:bg-[#F5C542]/20 transition"
  >
    <span className="text-xs font-bold uppercase tracking-widest">MauriStudio V1</span>
  </Link>
</div>
    </aside>
  );
}
