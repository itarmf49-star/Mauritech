import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const result = await odooRequest(
      "res.partner",
      "search_read",
      [
        [],
        {
          fields: ["name"],
          limit: 5,
        },
      ]
    );

    return Response.json({
      success: true,
      result,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}
