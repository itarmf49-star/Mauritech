"use client";

import { useState, memo, useCallback } from "react";
import type { AdminLocale } from "@/lib/admin-i18n";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

interface AdminShellProps {
  locale: AdminLocale;
  children: React.ReactNode;
}

export const AdminShell = memo(function AdminShell({ locale, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);
  const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="flex">
        <AdminSidebar 
          locale={locale} 
          open={sidebarOpen} 
          onClose={handleSidebarClose} 
        />
        <div className="flex-1 min-w-0">
          <AdminTopbar 
            locale={locale} 
            onOpenSidebar={handleSidebarOpen} 
          />
          <main className="px-4 sm:px-6 py-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
});