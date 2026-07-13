import { odooRequest } from "@/lib/odoo/client";

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
          "image_1920"
        ],
        limit: 50
      }
    ]
  );


  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Shop
      </h1>


      <div className="grid grid-cols-3 gap-6">

        {products.map((product:any)=>(
          <div 
            key={product.id}
            className="border rounded p-4"
          >

            <h2 className="font-bold">
              {product.name}
            </h2>

            <p>
              {product.list_price} MRU
            </p>


            <form action="/api/shop/order" method="POST">

              <input 
                type="hidden"
                name="productId"
                value={product.id}
              />


              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                شراء
              </button>

            </form>

          </div>
        ))}

      </div>

    </div>
  );
}
