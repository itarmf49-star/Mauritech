const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;

export async function odooRequest(
  model: string,
  method: string,
  args: any[] = []
) {
  const response = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          ODOO_DB,
          2,
          ODOO_PASSWORD,
          model,
          method,
          args,
        ],
      },
      id: Date.now(),
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error(
      "ODOO ERROR:",
      JSON.stringify(data.error, null, 2)
    );

    throw new Error(
      data.error.data?.message ||
      data.error.message ||
      "Odoo Server Error"
    );
  }

  return data.result;
}
