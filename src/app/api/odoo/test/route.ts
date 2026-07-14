import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {

    const products = await odooRequest(
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
        [
          "id",
          "name",
          "list_price",
          "image_1920",
          "qty_available"
        ]
      ]
    );


    return Response.json({
      success: true,
      products,
    });


  } catch (error:any) {

    return Response.json(
      {
        success:false,
        error:error.message
      },
      {
        status:500
      }
    );

  }
}
