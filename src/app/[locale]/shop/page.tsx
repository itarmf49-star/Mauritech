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



  let products: any[] = [];



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


    console.log("ODOO PRODUCTS:", products);


  } catch (error) {

    console.error(
      "ODOO SHOP ERROR:",
      error
    );

  }





  return (

    <main
      className="
        min-h-screen
        store-background
        py-10
        relative
      "
    >


      <div className="network-grid" />



      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-8
          relative
          z-10
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

        <section className="mt-16">



          <div className="mb-8">


            <h2

              className="
                text-3xl
                font-bold
                text-white
              "

            >

              All Products

            </h2>



            <p

              className="
                text-gray-300
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



            {products.length > 0 ? (


              products.map((product:any)=>(


                <ProductCard

                  key={product.id}

                  product={product}

                />


              ))



            ) : (


              <div

                className="
                  text-white
                  bg-black/30
                  rounded-2xl
                  p-6
                  border
                  border-white/10
                "

              >

                No products available from Odoo


              </div>


            )}



          </div>





        </section>





      </div>



    </main>

  );

}
