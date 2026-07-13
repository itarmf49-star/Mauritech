import { odooRequest } from "@/lib/odoo/client";
import ShopHero from "@/components/shop/ShopHero";
import ProductSlider from "@/components/shop/ProductSlider";
import ProductCard from "@/components/shop/ProductCard";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";


type ShopPageProps = {
  params: Promise<{
    locale: string;
  }>;
};



export default async function ShopPage({
  params,
}: ShopPageProps) {


  const {
    locale: rawLocale,
  } = await params;


  const locale: Locale = isLocale(rawLocale)
    ? rawLocale
    : defaultLocale;



  let products = [];

try {
  products = await odooRequest(
    "product.template",
    "search_read",
    [
      [
        [
          "sale_ok",
          "=",
          true
        ]
      ],
      {
        fields: [
          "id",
          "name",
          "list_price",
          "image_1920",
          "qty_available"
        ],
        limit: 50
      }
    ]
  );
} catch (error) {
  console.error("ODOO SHOP ERROR:", error);
}




  return (

    <main

className="
 min-h-screen
 store-background
 py-10
"

>


<div className="network-grid" />



      <div

        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-8
        "

      >



        {/* Store Hero */}

        <ShopHero

          locale={locale}

        />





        {/* Animated Products */}

        <ProductSlider

          products={products}

        />







        {/* All Products */}

        <section>



          <div className="mb-8">


            <h2

              className="
                text-3xl
                font-bold
                text-gray-900
              "

            >

              All Products

            </h2>



            <p

              className="
                text-gray-600
                mt-2
              "

            >

              Networking equipment available from Mauritech

            </p>



          </div>





          <div

            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-8
            "

          >



            {products.map((product:any)=>(


              <ProductCard

                key={product.id}

                product={product}

              />


            ))}



          </div>




        </section>




      </div>



    </main>

  );

}
