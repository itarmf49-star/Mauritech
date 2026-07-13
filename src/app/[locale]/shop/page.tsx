import { odooRequest } from "@/lib/odoo/client";
import BuyButton from "@/components/shop/BuyButton";


type ShopPageProps = {
  params: Promise<{
    locale: string;
  }>;
};


export default async function ShopPage({
  params,
}: ShopPageProps) {


  const { locale } = await params;


  let products:any[] = [];


  try {

    const result = await odooRequest(
      "product.template",
      "search_read",
      [
        [
          ["sale_ok", "=", true]
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


    products = Array.isArray(result)
      ? result
      : [];


  } catch(error) {

    console.error(
      "Odoo products error:",
      error
    );

  }



  return (

    <main
      className="
        min-h-screen
        bg-gray-50
        p-8
      "
    >


      <div
        className="
          max-w-7xl
          mx-auto
        "
      >


        <h1
          className="
            text-4xl
            font-bold
            mb-4
          "
        >

          Mauritech Store

        </h1>



        <p
          className="
            text-gray-600
            mb-10
          "
        >

          {locale === "ar"
            ? "معدات الشبكات والواي فاي والحلول الاحترافية"
            : locale === "fr"
            ? "Équipements réseau et solutions professionnelles"
            : "Networking equipment and professional solutions"
          }

        </p>





        {products.length === 0 && (

          <div
            className="
              bg-white
              rounded-xl
              p-10
              text-center
              shadow
            "
          >

            لا توجد منتجات متاحة حالياً

          </div>

        )}






        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >



          {products.map(
            (product:any)=>(


              <div

                key={product.id}

                className="
                  bg-white
                  rounded-xl
                  shadow
                  overflow-hidden
                "

              >



                {product.image_1920 ? (

                  <img

                    src={
                      `data:image/png;base64,${product.image_1920}`
                    }

                    alt={product.name}

                    className="
                      w-full
                      h-56
                      object-contain
                      p-4
                    "

                  />

                ) : (

                  <div
                    className="
                      h-56
                      flex
                      items-center
                      justify-center
                      bg-gray-100
                    "
                  >

                    No Image

                  </div>

                )}






                <div
                  className="
                    p-5
                  "
                >


                  <h2
                    className="
                      text-xl
                      font-bold
                      mb-3
                    "
                  >

                    {product.name}

                  </h2>




                  <p
                    className="
                      mb-2
                    "
                  >

                    السعر:

                    <span
                      className="
                        font-bold
                        ml-2
                      "
                    >

                      {product.list_price}

                    </span>

                    {" "}MRU

                  </p>




                  <p
                    className="
                      text-sm
                      text-gray-500
                      mb-5
                    "
                  >

                    المخزون:
                    {" "}
                    {product.qty_available ?? 0}

                  </p>



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


    </main>

  );

}
