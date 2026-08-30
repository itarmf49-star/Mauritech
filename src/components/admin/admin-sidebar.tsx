"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import {
  LayoutDashboard, FolderKanban, MessageSquare, Receipt, Users, 
  Settings, BarChart3, ClipboardList, Package, ShoppingCart, 
  Truck, ShieldCheck, ChevronRight, Palette, X, Smartphone
} from "lucide-react";
import { adminT, type AdminLocale } from "@/lib/admin-i18n";

interface AdminSidebarProps {
  locale: AdminLocale;
  open: boolean;
  onClose: () => void;
}

const NavIcon = memo(({ Icon, active }: { Icon: any; active: boolean }) => (
  <div className={`p-2 rounded-lg transition-all duration-300 ${
    active ? "bg-yellow-500/20 text-yellow-600" : "text-gray-800 group-hover:text-gray-900"
  }`}>
    <Icon className="h-4 w-4" strokeWidth={2.5} />
  </div>
));
NavIcon.displayName = "NavIcon";

const NavLink = memo(({ href, label, active, Icon, onClick }: { 
  href: string; 
  label: string; 
  active: boolean; 
  Icon: any; 
  onClick: () => void;
}) => (
  <Link 
    href={href} 
    prefetch={true}
    className={`group flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
      active 
        ? "bg-yellow-500/20 text-yellow-600 shadow-sm border-2 border-yellow-500" 
        : "text-gray-800 hover:text-amber-600 hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <NavIcon Icon={Icon} active={active} />
      {label}
    </div>
    {active && <ChevronRight className="h-3 w-3 text-yellow-600" />}
  </Link>
));
NavLink.displayName = "NavLink";

export function AdminSidebar({ locale, open, onClose }: AdminSidebarProps) {
  const pathname = usePathname() ?? "/";
  
  const isActive = useCallback((href: string) => pathname.startsWith(href), [pathname]);

  const menuGroups = useMemo(() => [
    {
      title: adminT(locale, "adminOverview"),
      items: [
        { key: "dashboard", href: `/${locale}/admin`, label: adminT(locale, "adminOverview"), Icon: LayoutDashboard },
        { key: "analytics", href: `/${locale}/admin/analytics`, label: adminT(locale, "adminAnalytics"), Icon: BarChart3 },
      ]
    },
    {
      title: "CONTENT",
      items: [
        { key: "content", href: `/${locale}/admin/content`, label: locale === "fr" ? "Contenu" : "المحتوى", Icon: Palette },
        { key: "settings", href: `/${locale}/admin/settings`, label: adminT(locale, "adminSettings"), Icon: Settings },
      ]
    },
    {
      title: "COMMUNICATION",
      items: [
        { key: "whatsapp", href: `/${locale}/admin/whatsapp`, label: "WhatsApp", Icon: MessageSquare },
      ]
    },
    {
      title: "SHOP",
      items: [
        { key: "inventory", href: `/${locale}/admin/inventory`, label: locale === "fr" ? "Inventaire" : "المخزون", Icon: Package },
        { key: "orders", href: `/${locale}/admin/orders`, label: adminT(locale, "adminOrders"), Icon: ShoppingCart },
        { key: "shipping", href: `/${locale}/admin/shipping`, label: adminT(locale, "adminShipping"), Icon: Truck },
      ]
    },
    {
      title: "ADMIN",
      items: [
        { key: "requests", href: `/${locale}/admin/requests`, label: adminT(locale, "adminRequests"), Icon: ClipboardList },
        { key: "customers", href: `/${locale}/admin/customers`, label: adminT(locale, "adminCustomers"), Icon: Users },
      ]
    }
  ], [locale]);

  const handleClose = useCallback(() => onClose(), [onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleClose}
        />
      )}
      
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[280px] bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Admin Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
              <LayoutDashboard className="text-white h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 tracking-tight">MauriTech</div>
              <div className="text-[10px] font-medium text-gray-600 uppercase tracking-widest">Admin</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-800 hover:text-amber-600 transition font-bold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <p className="px-4 text-[10px] font-bold text-gray-800 uppercase tracking-[0.2em] mb-3">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((it) => {
                  const active = isActive(it.href);
                  return (
                    <NavLink 
                      key={it.key} 
                      href={it.href} 
                      label={it.label}
                      active={active}
                      Icon={it.Icon}
                      onClick={handleClose}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border-2 border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-600 flex items-center justify-center text-[10px] font-bold text-white">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Admin Manager</p>
              <p className="text-[10px] text-gray-600 truncate">{adminT(locale, "adminVersion")}</p>
            </div>
            <ShieldCheck className="h-4 w-4 text-yellow-600" />
          </div>
        </div>
      </aside>
    </>
  );
}