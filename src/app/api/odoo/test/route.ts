import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const partners = await odooRequest(
      "res.partner",
      "search_read",
      [
        [],
        ["name", "email"]
      ]
    );

    return Response.json({
      success: true,
      partners,
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
