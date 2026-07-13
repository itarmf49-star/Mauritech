import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const customers = await odooRequest(
      "res.partner",
      "search_read",
      [
        [],
        [
          "id",
          "name",
          "email",
          "phone"
        ]
      ]
    );

    return Response.json({
      success: true,
      customers,
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error?.message || String(error),
    });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerId = await odooRequest(
      "res.partner",
      "create",
      [
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
        }
      ]
    );

    return Response.json({
      success: true,
      customerId,
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error?.message || String(error),
    });
  }
}
