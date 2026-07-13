"use client";

import { useEffect, useState } from "react";
import BuyButton from "@/components/shop/BuyButton";


export default function StoreFront() {


  const [products, setProducts] = useState<any[]>([]);



  useEffect(() => {


    async function loadProducts() {

      try {

        const res = await fetch(
          "/api/odoo/products"
        );


        const data = await res.json();


        setProducts(
          data.products || []
        );


      } catch (error) {

        console.error(
          "Store products error:",
          error
        );

      }

    }


    loadProducts();


  }, []);




  return (

    <section
      className="
        bg-[#0B1220]
        text-white
        py-20
        overflow-hidden
      "
    >


      <div className="max-w-7xl mx-auto px-6">



        {/* عنوان المتجر */}

        <div className="text-center mb-12">


          <h2
            className="
              text-4xl
              font-bold
              mb-4
            "
          >
            متجر Mauritech
          </h2>



          <p
            className="
              text-gray-300
              max-w-2xl
              mx-auto
            "
          >
            معدات الشبكات والاتصالات
            وحلول البنية التحتية
            المتوفرة مباشرة من مخزوننا.
          </p>


        </div>




        {/* مكان الفيديو */}


        <div
          className="
            rounded-2xl
            overflow-hidden
            mb-14
            bg-black
            h-[350px]
            flex
            items-center
            justify-center
          "
        >

          <video

            className="
              w-full
              h-full
              object-cover
            "

            autoPlay

            muted

            loop

          >

            <source
              src="/videos/store-banner.mp4"
              type="video/mp4"
            />

          </video>


        </div>





        {/* المنتجات المتحركة */}


        <div
          className="
            flex
            gap-6
            overflow-x-auto
            scroll-smooth
            pb-6
          "
        >


          {
            products.map(
              (product:any)=>(


              <div

                key={product.id}

                className="
                  min-w-[280px]
                  bg-white
                  text-black
                  rounded-2xl
                  p-5
                  shadow-lg
                  transition
                  hover:-translate-y-2
                "

              >



                {
                  product.image_1920 &&

                  <img

                    src={
                      `data:image/png;base64,${product.image_1920}`
                    }

                    alt={product.name}

                    className="
                      w-full
                      h-48
                      object-contain
                      mb-4
                    "

                  />

                }



                <h3
                  className="
                    font-bold
                    text-lg
                  "
                >
                  {product.name}
                </h3>



                <p
                  className="
                    mt-2
                    mb-4
                    text-blue-600
                    font-bold
                  "
                >
                  {product.list_price}
                  {" "}
                  MRU
                </p>



                <BuyButton

                  productId={
                    product.id
                  }

                />



              </div>


            ))
          }


        </div>



      </div>


    </section>

  );

}
