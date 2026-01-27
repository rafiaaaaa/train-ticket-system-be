import { Request, Response } from "express";
import { createBookingService, getBookingService } from "./booking.service";
import { success } from "zod";

export async function getBookingController(req: Request, res: Response) {
  const userId = req.user?.userId!;

  const booking = await getBookingService(
    userId,
    req.params.bookingId! as string,
  );

  return res.status(200).json({
    success: true,
    data: booking,
  });
}

export async function createBookingController(req: Request, res: Response) {
  const userId = req.user?.userId;
  const payload = { ...req.body, userId };

  const booking = await createBookingService(payload);

  res.status(201).json({
    success: true,
    data: booking,
  });
}
