const MIDTRANS_API_URL = process.env.MIDTRANS_API_URL!;
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;

export async function createPaymentLink(payload: any) {
  const res = await fetch(`${MIDTRANS_API_URL}/v1/payment-links`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(SERVER_KEY + ":").toString("base64"),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Midtrans error: ${error}`);
  }

  return res.json();
}
