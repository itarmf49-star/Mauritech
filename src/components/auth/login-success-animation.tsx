"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";

interface LoginSuccessAnimationProps {
  locale: "fr" | "ar";
  onComplete: () => void;
}

export function LoginSuccessAnimation({ locale, onComplete }: LoginSuccessAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 2500),
      setTimeout(() => onComplete(), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
      <style jsx global>{`
        @keyframes wave {
          0%, 100% {
            transform: rotate(12deg);
          }
          50% {
            transform: rotate(-12deg);
          }
        }
        @keyframes waveHand {
          0%, 100% {
            transform: translateX(0) rotate(12deg);
          }
          50% {
            transform: translateX(0) rotate(-12deg);
          }
        }
      `}</style>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Animated child character (CSS-based) */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Face */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full transition-all duration-700 ${
              step >= 1 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            {/* Eyes */}
            <div className="absolute top-12 left-10 w-4 h-4 bg-gray-900 rounded-full animate-bounce" />
            <div className="absolute top-12 right-10 w-4 h-4 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />

            {/* Smile */}
            <div
              className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-8 border-b-4 border-gray-900 rounded-full transition-all duration-500 ${
                step >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            />

            {/* Cheeks */}
            <div
              className={`absolute top-16 left-6 w-6 h-4 bg-pink-400/50 rounded-full transition-all duration-500 ${
                step >= 2 ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute top-16 right-6 w-6 h-4 bg-pink-400/50 rounded-full transition-all duration-500 ${
                step >= 2 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Waving hand */}
          <div
            className={`absolute -right-4 top-16 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ${
              step >= 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            style={{
              animation: step >= 2 ? "waveHand 0.5s ease-in-out infinite" : "none",
            }}
          />

          {/* Sparkles around */}
          <div
            className={`absolute -top-4 left-1/2 -translate-x-1/2 transition-all duration-500 ${
              step >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Success message */}
        <div
          className={`mb-4 transition-all duration-700 ${
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {locale === "fr" ? "Bienvenue !" : "مرحباً !"}
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            {locale === "fr"
              ? "Connexion réussie"
              : "تم تسجيل الدخول بنجاح"}
          </p>
        </div>

        {/* Redirect message */}
        <div
          className={`flex items-center justify-center gap-2 text-yellow-600 transition-all duration-700 ${
            step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-sm font-medium">
            {locale === "fr" ? "Redirection vers le tableau de bord..." : "جاري التوجيه إلى لوحة التحكم..."}
          </span>
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
