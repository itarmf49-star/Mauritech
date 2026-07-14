import { odooRequest } from "@/lib/odoo/client";


export async function GET() {

  try {

    const products = await odooRequest(
      "product.template",
      "search_read",
      [
        []
      ],
      {
        fields: [
          "id",
          "name",
          "sale_ok",
          "list_price",
          "qty_available"
        ],
        limit: 10
      }
    );


    return Response.json({
      success: true,
      products
    });


  } catch(error:any) {

    return Response.json({
      success:false,
      error:error.message
    });

  }

}
