import { createPaymentLink } from "../../integration/midtrans.integration";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../shared/errors/BadRequestError";
import { ConflictError } from "../../shared/errors/ConflictError";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import crypto from "crypto";

export async function payBooking({
  bookingId,
  userId,
}: {
  bookingId: string;
  userId: string;
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, userId },
    include: { payment: true },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status === "EXPIRED") {
    throw new BadRequestError("Booking expired");
  }

  if (booking.payment) {
    throw new ConflictError("Payment already exists");
  }

  if (booking.status !== "UNPAID") {
    throw new ConflictError("Booking already processed");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const paymentLink = await createPaymentLink({
    transaction_details: {
      order_id: bookingId,
      gross_amount: booking.totalPrice,
    },
    customer_details: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
    },
  });

  const payment = await prisma.$transaction(async (tx: any) => {
    const payment = await tx.payment.create({
      data: {
        bookingId,
        amount: booking.totalPrice,
        status: "PENDING",
        payment_url: paymentLink.payment_url,
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "PENDING",
      },
    });

    return payment;
  });

  return {
    payment,
    payment_url: paymentLink.payment_url,
  };
}
