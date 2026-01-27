import z from "zod";

export const payBookingSchema = z.object({
  bookingId: z.uuid(),
});
