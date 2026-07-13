import { odooRequest } from "@/lib/odoo/client";
import BuyButton from "@/components/shop/BuyButton";


export default async function ShopPage() {


  const products = await odooRequest(
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



  return (

    <div className="p-8">


      <h1 className="text-4xl font-bold mb-8">
        متجر Mauritech
      </h1>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">


        {products.map((product:any)=>(


          <div

            key={product.id}

            className="border rounded-xl overflow-hidden shadow-sm bg-white"

          >



            {product.image_1920 ? (

              <img

                src={
                  `data:image/png;base64,${product.image_1920}`
                }

                alt={product.name}

                className="w-full h-56 object-contain p-4"

              />

            ) : (

              <div className="w-full h-56 flex items-center justify-center bg-gray-100">

                No Image

              </div>

            )}



            <div className="p-5">


              <h2 className="text-xl font-bold mb-3">

                {product.name}

              </h2>



              <p className="text-lg mb-2">

                السعر:

                <span className="font-bold ml-2">

                  {product.list_price}

                </span>

                {" "}MRU

              </p>



              <p className="text-sm text-gray-600 mb-5">

                المخزون:

                {" "}

                {product.qty_available ?? 0}

              </p>




              <BuyButton

                productId={product.id}

              />



            </div>



          </div>


        ))}



      </div>


    </div>

  );

}
