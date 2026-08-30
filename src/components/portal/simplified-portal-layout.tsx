"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, FileText, MessageSquare, Settings, LogOut, Menu, X, Bell } from "lucide-react";
import { signOut } from "next-auth/react";
import { NotificationBell } from "@/components/portal/notification-bell";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { LightBeamBackground } from "@/components/shop/light-beam-background";

interface SimplifiedPortalLayoutProps {
  locale: "fr" | "ar";
  email: string;
  userName?: string;
  children: React.ReactNode;
}

export function SimplifiedPortalLayout({ locale, email, userName, children }: SimplifiedPortalLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = locale === "ar";

  const navItems = [
    { href: `/${locale}/portal`, icon: Home, label: locale === "fr" ? "Accueil" : "الرئيسية" },
    { href: `/${locale}/portal/orders`, icon: ShoppingCart, label: locale === "fr" ? "Mes Commandes" : "طلباتي" },
    { href: `/${locale}/portal/invoices`, icon: FileText, label: locale === "fr" ? "Factures" : "الفواتير" },
    { href: `/${locale}/portal/messages`, icon: MessageSquare, label: locale === "fr" ? "Messages" : "الرسائل" },
  ];

  const isActive = (href: string) => pathname === href || (pathname?.startsWith(href + "/") ?? false);

  return (
    <LightBeamBackground>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-gray-900">MauriTech</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell locale={locale} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-40 pt-20 px-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 transition font-bold ${
                  isActive(item.href) ? "bg-yellow-500/20 text-yellow-600" : "hover:bg-gray-100 hover:text-amber-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full font-bold"
            >
              <LogOut className="w-5 h-5" />
              {locale === "fr" ? "Déconnexion" : "تسجيل الخروج"}
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">MauriTech</h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            {locale === "fr" ? "Espace Client" : "مساحة العميل"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 transition font-bold ${
                isActive(item.href) ? "bg-yellow-500/20 text-yellow-600" : "hover:bg-gray-100 hover:text-amber-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full font-bold"
          >
            <LogOut className="w-5 h-5" />
            {locale === "fr" ? "Déconnexion" : "تسجيل الخروج"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-200 bg-white shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {navItems.find(item => isActive(item.href))?.label}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-medium">{email}</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell locale={locale} />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* WhatsApp Widget */}
      <WhatsAppWidget locale={locale} />
    </LightBeamBackground>
  );
}