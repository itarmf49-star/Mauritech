"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { t, type Locale } from "@/lib/i18n";

// حزمة three.js/@react-three-fiber ثقيلة — تُحمَّل فقط عند الحاجة الفعلية (صفحات موريتك
// التعريفية)، وبعد رسم المحتوى، بدل أن تُبطئ كل تنقّل بين الصفحات.
const FiberNetworkBackground = dynamic(
  () => import("@/components/three/FiberNetworkBackground").then((m) => m.FiberNetworkBackground),
  { ssr: false },
);

// أدوات الدردشة (الدعم المباشر ومساعد الذكاء الاصطناعي) عبارة عن أزرار عائمة لا يحتاجها
// معظم الزوار فوراً — تحميلها كسولاً (بعد الرسم الأول) يمنعها من إبطاء كل تنقّل بحزمة
// JS إضافية لا تُستخدم في الغالب.
const ChatDock = dynamic(() => import("@/components/chat/chat-dock").then((m) => m.ChatDock), { ssr: false });
const AiAssistant = dynamic(() => import("@/components/chat/ai-assistant").then((m) => m.AiAssistant), { ssr: false });

/** لوحات التحكم (الأدمن وبوابة الزبون) لها هيكلها الخاص بالكامل — لا يجب أن تُغلَّف
 *  بهيدر/فوتر/دردشة الموقع العام، وإلا تتراكب مع أزرارها وتفقد طابعها الاحترافي المستقل. */
function isAppShellRoute(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const afterLocale = parts.slice(1).join("/");
  return afterLocale.startsWith("admin") || afterLocale.startsWith("portal");
}

/** صفحات المتجر تعتمد طابعاً فاتحاً (أمازون) — لا تُناسبها الخلفية الليلية المتحركة لصفحات موريتك التعريفية. */
function isMarketplaceRoute(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const afterLocale = parts.slice(1).join("/");
  return (
    afterLocale === "" ||
    afterLocale.startsWith("product/") ||
    afterLocale.startsWith("store/") ||
    afterLocale.startsWith("shop") ||
    afterLocale.startsWith("cart") ||
    afterLocale.startsWith("checkout") ||
    afterLocale.startsWith("services")
  );
}

export function ChromeGate({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isAppShell = isAppShellRoute(pathname);
  const isMarketplace = !isAppShell && isMarketplaceRoute(pathname);

  useEffect(() => {
    document.body.classList.toggle("theme-light-market", isMarketplace);
  }, [isMarketplace]);

  if (isAppShell) {
    return <>{children}</>;
  }

  return (
    <>
      {!isMarketplace && <FiberNetworkBackground />}
      <a href="#main-content" className="skip-link">
        {t(locale, "skipToContent")}
      </a>
      <SiteHeader locale={locale} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} />
      <ChatDock locale={locale} />
      <AiAssistant locale={locale} />
    </>
  );
}
