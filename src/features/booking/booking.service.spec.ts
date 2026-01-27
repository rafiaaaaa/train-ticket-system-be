import { describe, test, expect } from "bun:test";
import { createBookingService } from "./booking.service";

describe("createBookingService", () => {
  test("should create booking successfully", async () => {
    const booking = await createBookingService({
      userId: "11111111-1111-1111-1111-111111111111",
      scheduleId: "66666666-6666-6666-6666-666666666666",
      seatIds: [
        "55555555-5555-5555-5555-555555555551",
        "55555555-5555-5555-5555-555555555552",
      ],
    });

    expect(booking).toBeDefined();
    expect(booking).toHaveProperty("booking");
    expect(booking).toHaveProperty("bookingSeats");
  });
});
