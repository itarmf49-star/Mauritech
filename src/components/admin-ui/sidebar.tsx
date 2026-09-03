"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, MessageSquare, Users,
  Settings, BarChart3, ClipboardList,
  Palette, Package, ShoppingCart, Truck, LogOut,
  ChevronRight, LayoutGrid, FileText, Store, Tag, BookOpen, X, Layers, Wrench,
} from "lucide-react";
import { localePath, t, type Locale } from "@/lib/i18n";

const NavIcon = ({ Icon, active }: { Icon: any; active: boolean }) => (
  <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`} strokeWidth={2} />
);

export function AdminSidebar({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const pathname = usePathname() ?? "/";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const menuGroups = [
    {
      title: t(locale, "adminNavGeneral"),
      items: [
        { key: "dashboard", href: localePath(locale, "/admin"), label: t(locale, "adminOverview"), Icon: LayoutDashboard },
        { key: "analytics", href: localePath(locale, "/admin/analytics"), label: t(locale, "adminAnalytics"), Icon: BarChart3 },
      ],
    },
    {
      title: t(locale, "adminNavContent"),
      items: [
        { key: "studio", href: localePath(locale, "/admin/studio"), label: t(locale, "adminStudio"), Icon: Palette },
        { key: "services", href: localePath(locale, "/admin/services"), label: t(locale, "adminServices"), Icon: Wrench },
      ],
    },
    {
      title: t(locale, "adminNavShop"),
      items: [
        { key: "stores", href: localePath(locale, "/admin/stores"), label: t(locale, "adminStores"), Icon: Store },
        { key: "products", href: localePath(locale, "/admin/products"), label: t(locale, "adminProducts"), Icon: Package },
        { key: "categories", href: localePath(locale, "/admin/categories"), label: t(locale, "adminCategories"), Icon: Layers },
        { key: "orders", href: localePath(locale, "/admin/orders"), label: t(locale, "adminOrders"), Icon: ShoppingCart },
        { key: "offers", href: localePath(locale, "/admin/offers"), label: t(locale, "adminOffers"), Icon: Tag },
        { key: "stories", href: localePath(locale, "/admin/stories"), label: t(locale, "adminStories"), Icon: BookOpen },
        { key: "inventory", href: localePath(locale, "/admin/inventory"), label: t(locale, "adminInventory"), Icon: ClipboardList },
        { key: "shipping", href: localePath(locale, "/admin/shipping"), label: t(locale, "adminShipping"), Icon: Truck },
      ],
    },
    {
      title: t(locale, "adminNavAdministration"),
      items: [
        { key: "requests", href: localePath(locale, "/admin/requests"), label: t(locale, "adminRequests"), Icon: ClipboardList },
        { key: "requirements", href: localePath(locale, "/admin/requirements"), label: t(locale, "adminRequirements"), Icon: FileText },
        { key: "chat", href: localePath(locale, "/admin/chat"), label: t(locale, "adminChat"), Icon: MessageSquare },
        { key: "customers", href: localePath(locale, "/admin/customers"), label: t(locale, "adminCustomers"), Icon: Users },
        { key: "settings", href: localePath(locale, "/admin/settings"), label: t(locale, "adminSettings"), Icon: Settings },
      ],
    },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed md:sticky top-0 z-50 h-dvh w-[264px] bg-white border-e border-gray-100 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ insetInlineStart: 0 }}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
              <LayoutGrid className="text-white h-4 w-4" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-gray-900 leading-tight">MauriTech</div>
              <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{t(locale, "adminStudio")}</div>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map((it) => {
                  const active = isActive(it.href);
                  return (
                    <Link
                      key={it.key}
                      href={it.href}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                        active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <NavIcon Icon={it.Icon} active={active} />
                        {it.label}
                      </div>
                      {active && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50">
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate">{t(locale, "adminManagerRole")}</p>
              <p className="text-[11px] text-gray-400 truncate">{t(locale, "adminSystemVersion")}</p>
            </div>
            <button
              onClick={() => void signOut({ callbackUrl: localePath(locale, "/") })}
              className="text-gray-400 hover:text-gray-700"
              aria-label={t(locale, "portalLogout")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
