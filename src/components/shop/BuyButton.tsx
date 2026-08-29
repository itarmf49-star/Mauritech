"use client";

import { useState } from "react";

interface BuyButtonProps {
  productId: string;
}

export default function BuyButton({
  productId,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    try {
      setLoading(true);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل إضافة المنتج إلى السلة");
      }

      alert("تمت إضافة المنتج إلى السلة بنجاح");
    } catch (error: any) {
      console.error("Cart error:", error);
      alert(error.message || "حدث خطأ أثناء إضافة المنتج إلى السلة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="
        w-full
        bg-[#F5C542]
        hover:bg-[#D4AF2E]
        text-black
        py-3
        rounded-lg
        font-bold
        transition
        disabled:opacity-50
      "
    >
      {loading ? "جارٍ الإضافة..." : "أضف إلى السلة"}
    </button>
  );
}
