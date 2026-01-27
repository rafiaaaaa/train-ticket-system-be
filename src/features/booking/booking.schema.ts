import { z } from "zod";

export const createBookingSchema = z.object({
  scheduleId: z.uuid(),
  seatIds: z.array(z.uuid()).min(1),
});
export type createBookingRequest = z.infer<typeof createBookingSchema>;
