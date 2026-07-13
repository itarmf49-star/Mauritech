import { odooRequest } from "@/lib/odoo/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
    return Response.json({
      success: false,
      error: error?.message || String(error),
    });
  }
}
