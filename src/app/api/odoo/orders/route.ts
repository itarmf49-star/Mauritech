import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  return Response.json({
    success: true,
    message: "Orders API is running",
  });
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      partner_id,
      product_id,
      quantity = 1,
    } = body;


    if (!partner_id) {
      return Response.json(
        {
          success: false,
          error: "partner_id is required",
        },
        { status: 400 }
      );
    }


    if (!product_id) {
      return Response.json(
        {
          success: false,
          error: "product_id is required",
        },
        { status: 400 }
      );
    }


    const orderId = await odooRequest(
      "sale.order",
      "create",
      [
        {
          partner_id,

          order_line: [
            [
              0,
              0,
              {
                product_id,
                product_uom_qty: quantity,
              },
            ],
          ],
        },
      ]
    );


    return Response.json({
      success: true,
      orderId,
      message: "Order created successfully",
    });


  } catch (error: any) {

    console.error("Odoo order error:", error);


    return Response.json(
      {
        success: false,
        error: error?.message || String(error),
      },
      { status: 500 }
    );

  }
}
