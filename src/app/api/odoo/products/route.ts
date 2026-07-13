import { odooRequest } from "@/lib/odoo/client";

export async function GET() {
  try {
    const products = await odooRequest(
      "product.product",
      "search_read",
      [
        [],
        [
  "id",
  "name",
  "default_code",
  "list_price",
  "qty_available",
  "image_1920"
]
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
