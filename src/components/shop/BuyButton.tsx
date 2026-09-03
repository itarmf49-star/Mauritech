"use client";

import { useState } from "react";
import { defaultLocale, t, type Locale } from "@/lib/i18n";

interface BuyButtonProps {
  productId: string;
  locale?: Locale;
}

export default function BuyButton({ productId, locale = defaultLocale }: BuyButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">("idle");

  async function handleBuy() {
    try {
      setStatus("loading");

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error("failed");

      setStatus("added");
      window.dispatchEvent(new Event("cart:updated"));
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Cart error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const label =
    status === "loading" ? t(locale, "adminLoading")
    : status === "added" ? `✓ ${t(locale, "cartItemAdded")}`
    : status === "error" ? t(locale, "adminSettingsError")
    : t(locale, "shopAddToCart");

  return (
    <button
      onClick={handleBuy}
      disabled={status === "loading"}
      className={`w-full py-2.5 rounded-full font-bold text-sm transition disabled:opacity-60 ${
        status === "added"
          ? "bg-green-600 text-white"
          : status === "error"
          ? "bg-red-600 text-white"
          : "bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200]"
      }`}
    >
      {label}
    </button>
  );
}
