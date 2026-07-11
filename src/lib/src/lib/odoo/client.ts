const ODOO_URL = process.env.ODOO_URL;

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
          process.env.ODOO_DB,
          Number(process.env.ODOO_UID),
          process.env.ODOO_PASSWORD,
          model,
          method,
          args,
        ],
      },
      id: 1,
    }),
  });

  return response.json();
}
