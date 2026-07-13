"use client";

import { useEffect, useState } from "react";
import BuyButton from "@/components/shop/BuyButton";
import type { Locale } from "@/lib/i18n";


type StoreFrontProps = {
  locale: Locale;
};



export default function StoreFront({
  locale,
}: StoreFrontProps) {


  const [products, setProducts] = useState<any[]>([]);



  const content = {

    ar: {
      title: "متجر Mauritech",
      description:
        "معدات الشبكات والاتصالات وحلول البنية التحتية المتوفرة مباشرة من مخزوننا.",
      price: "السعر",
      video:
        "فيديو حلول Mauritech",
    },


    fr: {
      title: "Boutique Mauritech",
      description:
        "Équipements réseau, connectivité et solutions d’infrastructure disponibles directement depuis notre stock.",
      price: "Prix",
      video:
        "Vidéo des solutions Mauritech",
    },


    en: {
      title: "Mauritech Store",
      description:
        "Networking equipment, connectivity and infrastructure solutions available directly from our stock.",
      price: "Price",
      video:
        "Mauritech Solutions Video",
    },

  };



  const text = content[locale];



  useEffect(() => {

    async function loadProducts() {

      try {

        const res =
          await fetch("/api/odoo/products");


        const data =
          await res.json();


        setProducts(
          data.products || []
        );


      } catch(error) {

        console.error(
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
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
        "
      >


        <div className="text-center mb-12">


          <h2
            className="
              text-4xl
              font-bold
            "
          >

            {text.title}

          </h2>


          <p
            className="
              mt-4
              text-gray-300
              max-w-3xl
              mx-auto
            "
          >

            {text.description}

          </p>


        </div>




        {/* Video Area */}

        <div
          className="
            h-[350px]
            rounded-2xl
            overflow-hidden
            bg-black
            mb-14
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





        {/* Products Slider */}


        <div
          className="
            flex
            gap-6
            overflow-x-auto
            pb-6
          "
        >


          {products.map(
            (product:any)=>(


              <div

                key={product.id}

                className="
                  min-w-[280px]
                  bg-white
                  text-black
                  rounded-2xl
                  p-5
                  transition
                  hover:scale-105
                "

              >


                {product.image_1920 && (

                  <img

                    src={
                    `data:image/png;base64,${product.image_1920}`
                    }

                    alt={product.name}

                    className="
                      h-48
                      w-full
                      object-contain
                    "

                  />

                )}



                <h3
                  className="
                    font-bold
                    mt-4
                  "
                >

                  {product.name}

                </h3>



                <p
                  className="
                    text-blue-600
                    font-bold
                    mt-3
                  "
                >

                  {text.price}:
                  {" "}
                  {product.list_price}
                  {" "}
                  MRU

                </p>



                <div className="mt-5">


                  <BuyButton
                    productId={
                      product.id
                    }
                  />


                </div>


              </div>


            )

          )}


        </div>


      </div>


    </section>

  );

}
