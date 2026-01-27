import crypto from "crypto";

export function validateMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const payload = orderId + statusCode + grossAmount + serverKey;

  const expectedSignature = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");

  return signatureKey === expectedSignature;
}
