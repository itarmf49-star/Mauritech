import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const products = await odooRequest(
      "product.template",
      "search_read",
      [
        [],
        ["id", "name", "list_price", "default_code"]
      ]
    );

    return Response.json({
      success: true,
      products,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error?.message || String(error),
    });
  }
}
