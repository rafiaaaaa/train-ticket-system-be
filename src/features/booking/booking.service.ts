import { prisma } from "../../lib/prisma";
import { ConflictError } from "../../shared/errors/ConflictError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

export type bookingPayload = {
  userId: string;
  scheduleId: string;
  seatIds: string[];
};

export async function getBookingService(userId: string, bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      userId,
    },
    select: {
      id: true,
      status: true,
      totalPrice: true,
      bookingSeats: {
        select: {
          seat: {
            select: {
              number: true,
            },
          },
        },
      },
      payment: {
        select: {
          payment_url: true,
        },
      },
      schedule: {
        select: {
          train: {
            select: {
              name: true,
              code: true,
            },
          },
          route: {
            select: {
              originStation: {
                select: {
                  name: true,
                  city: true,
                },
              },
              destinationStation: {
                select: {
                  name: true,
                  city: true,
                },
              },
            },
          },
          departureTime: true,
          arrivalTime: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  return {
    bookingId: booking.id,
    status: booking.status,
    totalPrice: booking.totalPrice,
    paymentUrl: booking.payment?.payment_url,
    train: {
      name: booking.schedule.train.name,
      code: booking.schedule.train.code,
    },
    route: {
      origin: booking.schedule.route.originStation,
      destination: booking.schedule.route.destinationStation,
    },
    departureTime: booking.schedule.departureTime,
    arrivalTime: booking.schedule.arrivalTime,
    seats: booking.bookingSeats.map((bs: any) => bs.seat.number),
  };
}

export async function createBookingService(payload: bookingPayload) {
  const data = await prisma.$transaction(async (tx: any) => {
    const schedule = await tx.schedule.findUnique({
      where: { id: payload.scheduleId },
      select: {
        price: true,
      },
    });

    if (!schedule) {
      throw new NotFoundError("Schedule not found");
    }

    const booking = await tx.booking.create({
      data: {
        userId: payload.userId,
        scheduleId: payload.scheduleId,
        status: "UNPAID",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        totalPrice: schedule.price * payload.seatIds.length,
      },
    });

    const bookingSeats = await tx.bookingSeat.createMany({
      data: payload.seatIds.map((id) => ({
        bookingId: booking.id,
        seatId: id,
        scheduleId: payload.scheduleId,
      })),
      skipDuplicates: true,
    });

    if (bookingSeats.count < payload.seatIds.length) {
      throw new ConflictError("Seats are not available");
    }

    return { booking, bookingSeats };
  });

  return data;
}
