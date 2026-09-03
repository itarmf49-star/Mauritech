"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { AdminSidebar } from "@/components/admin-ui/sidebar";
import { AdminTopbar } from "@/components/admin-ui/topbar";

export function AdminShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-content-light min-h-screen bg-[#F7F8FA] text-gray-900">
      <div className="flex">
        <AdminSidebar locale={locale} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0">
          <AdminTopbar locale={locale} onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="px-4 sm:px-6 py-6">
            <div className="max-w-[1400px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

