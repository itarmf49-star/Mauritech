import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const result = await odooRequest(
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
      data: result,
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
