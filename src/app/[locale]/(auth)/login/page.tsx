"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { LoginSuccessAnimation } from "@/components/auth/login-success-animation";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale } from "@/lib/i18n";

export default function LoginPage() {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const [showModal, setShowModal] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLoginSuccess = () => {
    setShowModal(false);
    setShowSuccess(true);
  };

  const handleAnimationComplete = () => {
    // Animation complete, redirect will happen in the modal
    setShowSuccess(false);
  };

  return (
    <>
      {/* Background content (blurred when modal is open) */}
      <div className={`min-h-screen bg-white flex items-center justify-center transition-all duration-300 ${showModal ? "blur-sm" : ""}`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MauriTech</h1>
          <p className="text-gray-600 font-medium">
            {locale === "fr" ? "Plateforme de services technologiques" : "منصة الخدمات التكنولوجية"}
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Success Animation */}
      {showSuccess && (
        <LoginSuccessAnimation
          locale={locale as "fr" | "ar"}
          onComplete={handleAnimationComplete}
        />
      )}
    </>
  );
}

