import { describe, expect, test } from "bun:test";
import { payBooking } from "./payment.service";

describe("paymentService", () => {
  test("should booking payment successfully", async () => {
    const result = await payBooking({
      bookingId: "89fd5604-6154-4d8c-8f22-50d8d31b514f",
      userId: "11111111-1111-1111-1111-111111111111",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
  });
});
