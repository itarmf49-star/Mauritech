"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, t } from "@/lib/i18n";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const params = useParams();
  const search = useSearchParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const next = search?.get("next") ?? `/${locale}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Validate inputs
    if (!email || !password) {
      setError(locale === "fr" ? "Veuillez remplir tous les champs" : "يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
        callbackUrl: next,
      });
      
      if (res?.error) {
        setError(locale === "fr" ? "Identifiants invalides" : "بيانات الاعتماد غير صالحة");
        setLoading(false);
      } else if (res?.ok) {
        // Success - trigger animation
        onSuccess();
        // Redirect after animation completes
        setTimeout(() => {
          window.location.href = res.url ?? next;
        }, 3500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(locale === "fr" ? "Erreur de connexion" : "خطأ في الاتصال");
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("mauritech@mauritech.tech");
    setPassword("MauriTech@2026");
    setError(null);
    // Auto-submit after setting values
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }, 100);
  };

  const clearError = () => {
    if (error) setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-md">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {locale === "fr" ? "Connexion" : "تسجيل الدخول"}
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              {locale === "fr"
                ? "Connectez-vous à votre compte MauriTech"
                : "سجل الدخول إلى حسابك في MauriTech"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-medium">
                {locale === "fr" ? "Email" : "البريد الإلكتروني"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      (document.querySelector('input[type="password"]') as HTMLInputElement)?.focus();
                    }
                  }}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                  placeholder={locale === "fr" ? "votre@email.com" : "بريدك@الإلكتروني.com"}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2 font-medium">
                {locale === "fr" ? "Mot de passe" : "كلمة المرور"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                  placeholder={locale === "fr" ? "••••••••" : "••••••••"}
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {locale === "fr" ? "Connexion..." : "جاري الاتصال..."}
                </>
              ) : (
                locale === "fr" ? "Se connecter" : "تسجيل الدخول"
              )}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-gray-100 border-2 border-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {locale === "fr" ? "Démo Admin (Auto-login)" : "تجربة المسؤول (تسجيل تلقائي)"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <Link
              href={`/${locale}/forgot-password`}
              className="block text-sm text-yellow-600 hover:text-yellow-700 transition font-medium"
            >
              {locale === "fr" ? "Mot de passe oublié ?" : "نسيت كلمة المرور؟"}
            </Link>
            <div className="text-sm text-gray-600 font-medium">
              {locale === "fr" ? "Pas encore de compte ?" : "ليس لديك حساب؟"}{" "}
              <Link
                href={`/${locale}/register`}
                className="text-yellow-600 hover:text-yellow-700 transition font-bold"
              >
                {locale === "fr" ? "Créer un compte" : "إنشاء حساب"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
