import { PaymentStatus, BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function handleNotification(payload: any) {
  const { order_id, transaction_status, fraud_status } = payload;
  const normalizedOrderId = order_id.substring(0, 36);

  const payment = await prisma.payment.findUnique({
    where: { bookingId: normalizedOrderId },
    include: { booking: true },
  });
  console.log("payment", payment);
  if (!payment) {
    throw new Error("Payment not found");
  }

  let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
  let bookingStatus: BookingStatus = BookingStatus.PENDING;

  if (transaction_status === "settlement" || transaction_status === "capture") {
    if (!fraud_status || fraud_status === "accept") {
      paymentStatus = PaymentStatus.PAID;
      bookingStatus = BookingStatus.PAID;
    }
  }

  if (["deny", "cancel", "expire", "failure"].includes(transaction_status)) {
    paymentStatus = PaymentStatus.FAILED;
    bookingStatus = BookingStatus.UNPAID;
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { bookingId: normalizedOrderId },
      data: {
        status: paymentStatus,
        paidAt: paymentStatus === "PAID" ? new Date() : null,
      },
    }),

    prisma.booking.update({
      where: { id: normalizedOrderId },
      data: {
        status: bookingStatus,
      },
    }),
  ]);

  return {
    bookingId: normalizedOrderId,
    paymentStatus,
    bookingStatus,
  };
}
