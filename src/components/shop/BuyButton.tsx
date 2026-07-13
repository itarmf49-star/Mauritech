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

            partner_id: 1,

            product_id: productId,

            quantity: 1,

          }),

        }
      );



      const data = await response.json();



      if (!data.success) {

        throw new Error(
          data.error || "Order creation failed"
        );

      }



      alert(
        `تم إنشاء الطلب بنجاح رقم: ${data.orderId}`
      );



    } catch (error:any) {


      console.error(
        "Buy error:",
        error
      );


      alert(
        error.message || "حدث خطأ أثناء الطلب"
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
        disabled:opacity-50
      "

    >

      {loading
        ? "جاري إنشاء الطلب..."
        : "شراء"
      }


    </button>


  );

}
