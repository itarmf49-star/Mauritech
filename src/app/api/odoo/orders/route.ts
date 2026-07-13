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

    if (!body.partner_id) {
      return Response.json(
        {
          success: false,
          error: "partner_id is required",
        },
        { status: 400 }
      );
    }

    const orderId = await odooRequest(
      "sale.order",
      "create",
      [
        {
          partner_id: body.partner_id,
        },
      ]
    );

    return Response.json({
      success: true,
      orderId,
    });

  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
