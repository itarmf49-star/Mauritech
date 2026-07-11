import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const partners = await odooRequest(
      "res.partner",
      "search_read",
      [
        [],
        {
          fields: ["name", "email"],
          limit: 5,
        },
      ]
    );

    return Response.json({
      success: true,
      partners,
    });

  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
