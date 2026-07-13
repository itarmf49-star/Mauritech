"use client";

import { useState } from "react";


interface BuyButtonProps {
  productId: number;
}



export default function BuyButton({
  productId,
}: BuyButtonProps) {


  const [loading, setLoading] = useState(false);



  async function handleBuy() {

    try {

      setLoading(true);


      const response = await fetch(
        "/api/odoo/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            product_id: productId,

            quantity: 1,

          }),

        }
      );



      const data = await response.json();



      if (!response.ok || !data.success) {

        throw new Error(
          data.error || "فشل إنشاء الطلب"
        );

      }



      alert(
        `تم إنشاء الطلب بنجاح رقم ${data.orderId}`
      );



    } catch (error: any) {


      console.error(
        "Order error:",
        error
      );


      alert(
        error.message ||
        "حدث خطأ أثناء إنشاء الطلب"
      );


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
        bg-blue-600
        hover:bg-blue-700
        text-white
        py-3
        rounded-lg
        font-semibold
        transition
        disabled:opacity-50
      "

    >

      {
        loading
          ? "جاري إنشاء الطلب..."
          : "شراء"
      }


    </button>

  );

}
