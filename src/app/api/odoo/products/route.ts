import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const products = await odooRequest(
      "product.template",
      "search_read",
      [
        [],
        {
          fields: [
            "id",
            "name",
            "list_price",
            "default_code",
          ],
          limit: 100,
        },
      ]
    );

    return Response.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error("ODOO ERROR:", error);

    return Response.json({
      success: false,
      error: error?.message || String(error),
      details: error,
    });
  }
}
