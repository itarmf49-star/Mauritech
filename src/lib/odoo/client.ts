const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;


async function rpc(
  service: string,
  method: string,
  args: any[]
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
        service,
        method,
        args,
      },
      id: Date.now(),
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error("ODOO ERROR:", data.error);
    throw new Error(
      data.error.data?.message ||
      data.error.message ||
      "Odoo Error"
    );
  }

  return data.result;
}


export async function odooLogin() {
  const uid = await rpc(
    "common",
    "authenticate",
    [
      ODOO_DB,
      ODOO_USERNAME,
      ODOO_PASSWORD,
      {},
    ]
  );

  if (!uid) {
    throw new Error("Odoo authentication failed");
  }

  return uid;
}


export async function odooRequest(
  model: string,
  method: string,
  args: any[] = []
) {

  const uid = await odooLogin();

  return rpc(
    "object",
    "execute_kw",
    [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      model,
      method,
      args,
    ]
  );
}
