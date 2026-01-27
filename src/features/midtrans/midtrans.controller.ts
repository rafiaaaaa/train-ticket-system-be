import { Request, Response } from "express";
import { validateMidtransSignature } from "../../utils/midtrans-signature";
import { handleNotification } from "./midtrans.service";

export async function midtransWebhook(req: Request, res: Response) {
  try {
    const { order_id, status_code, gross_amount, signature_key } = req.body;

    const isValid = validateMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      signature_key,
    );

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid Midtrans signature",
      });
    }

    await handleNotification(req.body);

    return res.status(200).json({
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
