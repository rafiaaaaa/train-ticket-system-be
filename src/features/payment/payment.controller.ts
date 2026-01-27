import { Request, Response } from "express";
import { payBooking } from "./payment.service";


export const createBookingPayment = async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const { bookingId } = req.body;
  const payload = { bookingId, userId };
  const result = await payBooking(payload);

  return res.status(201).json({
    success: true,
    data: result,
  });
};
