"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  Menu, X, User, ChevronDown, 
  Search, LogOut, Package, HeadphonesIcon 
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSession } from "next-auth/react";
import { AnnouncementMarquee } from "@/components/announcement-marquee";
import { AnimatedShoppingCart } from "@/components/animated-shopping-cart";
import type { Locale } from "@/lib/i18n";

interface ConsolidatedNavProps {
  locale: Locale;
}

export function ConsolidatedNav({ locale }: ConsolidatedNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: `/${locale}/services`, label: locale === "fr" ? "Services" : "الخدمات" },
    { href: `/${locale}/coverage`, label: locale === "fr" ? "Couverture" : "التغطية" },
    { href: `/${locale}/shop`, label: locale === "fr" ? "Boutique" : "المتجر" },
    { href: `/${locale}/contact`, label: locale === "fr" ? "Contact" : "اتصل بنا" },
  ];

  const accountItems = [
    { 
      icon: <User className="w-4 h-4" />,
      label: locale === "fr" ? "Profil" : "الملف الشخصي",
      href: session ? `/${locale}/portal/account` : `/${locale}/login`
    },
    { 
      icon: <Package className="w-4 h-4" />,
      label: locale === "fr" ? "Mes commandes" : "طلباتي",
      href: session ? `/${locale}/portal/invoices` : `/${locale}/login`
    },
    { 
      icon: <HeadphonesIcon className="w-4 h-4" />,
      label: locale === "fr" ? "Support" : "الدعم",
      href: session ? `/${locale}/portal/tickets` : `/${locale}/contact`
    },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
      {/* Announcement Marquee */}
      <div className="hidden md:block">
        {/* @ts-ignore - dynamic import */}
        <AnnouncementMarquee />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} prefetch={true} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-bold text-gray-900">MauriTech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="text-sm font-bold text-gray-800 hover:text-amber-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-800 hover:text-amber-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Animated Shopping Cart */}
            <AnimatedShoppingCart />

            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />

            {/* Consolidated Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-800 hover:text-amber-600 transition-colors"
              >
                {session?.user?.name ? (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {session ? (
                    <>
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-bold text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-600">{session.user?.email}</p>
                      </div>
                      <div className="p-2">
                        {accountItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800 hover:text-amber-600 transition-colors text-sm font-bold"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="p-2 border-t border-gray-200">
                        <button
                          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-gray-800 hover:text-red-600 transition-colors text-sm font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      <Link
                        href={`/${locale}/login`}
                        prefetch={true}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800 hover:text-amber-600 transition-colors text-sm font-bold"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        href={`/${locale}/register`}
                        prefetch={true}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-bold"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-800 hover:text-amber-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-800 hover:text-amber-600 transition-colors font-bold"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}