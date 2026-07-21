"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, MessageSquare, Receipt, Users, 
  Settings, Router, BarChart3, ClipboardList, DollarSign, 
  Palette, Package, ShoppingCart, Truck, ShieldCheck, 
  ChevronRight, LayoutGrid
} from "lucide-react";
import { localePath, t, type Locale } from "@/lib/i18n";

// مكون أيقونة محسّن
const NavIcon = ({ Icon, active }: { Icon: any; active: boolean }) => (
  <div className={`p-2 rounded-lg transition-all duration-300 ${
    active ? "bg-[#F5C542]/10 text-[#F5C542]" : "text-white/40 group-hover:text-white/80"
  }`}>
    <Icon className="h-4 w-4" strokeWidth={2.5} />
  </div>
);

export function AdminSidebar({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const pathname = usePathname() ?? "/";
  const isActive = (href: string) => pathname.startsWith(href);

  // هيكلية النظام: مقسمة حسب الوظيفة (موقع، متجر، تواصل، أدوات)
  const menuGroups = [
    {
      title: "GÉNÉRAL",
      items: [
        { key: "dashboard", href: localePath(locale, "/admin"), label: "Tableau de bord", Icon: LayoutDashboard },
        { key: "analytics", href: localePath(locale, "/admin/analytics"), label: "Statistiques", Icon: BarChart3 },
      ]
    },
    {
      title: "CONTENU & DESIGN",
      items: [
        { key: "studio", href: localePath(locale, "/admin/studio"), label: "MauriStudio Pro", Icon: Palette },
        { key: "projects", href: localePath(locale, "/admin/projects"), label: "Projets (CMS)", Icon: FolderKanban },
      ]
    },
    {
      title: "BOUTIQUE",
      items: [
        { key: "products", href: localePath(locale, "/admin/products"), label: "Produits", Icon: Package },
        { key: "orders", href: localePath(locale, "/admin/orders"), label: "Commandes", Icon: ShoppingCart },
        { key: "shipping", href: localePath(locale, "/admin/shipping"), label: "Livraisons", Icon: Truck },
      ]
    },
    {
      title: "ADMINISTRATION",
      items: [
        { key: "requests", href: localePath(locale, "/admin/requests"), label: "Demandes", Icon: ClipboardList },
        { key: "customers", href: localePath(locale, "/admin/customers"), label: "Clients", Icon: Users },
        { key: "settings", href: localePath(locale, "/admin/settings"), label: "Paramètres", Icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`fixed md:sticky top-0 left-0 z-50 h-dvh w-[280px] bg-[#0B0F14] border-r border-white/10 flex flex-col transition-all duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
      
      {/* هيدر الاستوديو */}
      <div className="h-20 px-8 flex items-center border-b border-white/5 bg-[#0B0F14]/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutGrid className="text-white h-6 w-6" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-white tracking-tight">Mauritech</div>
            <div className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Dashboard Studio</div>
          </div>
        </div>
      </div>

      {/* قائمة الروابط بنظام المجموعات */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <Link 
                    key={it.key} 
                    href={it.href} 
                    className={`group flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      active 
                        ? "bg-[#1C2128] text-white shadow-sm border border-white/5" 
                        : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <NavIcon Icon={it.Icon} active={active} />
                      {it.label}
                    </div>
                    {active && <ChevronRight className="h-3 w-3 text-[#F5C542]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* تذييل احترافي مع حالة النظام */}
      <div className="p-6 border-t border-white/5 bg-[#0B0F14]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center text-[10px] font-bold text-black">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">Admin Manager</p>
            <p className="text-[10px] text-white/40 truncate">System v1.0.0</p>
          </div>
          <ShieldCheck className="h-4 w-4 text-green-500" />
        </div>
      </div>
    </aside>
  );
}
