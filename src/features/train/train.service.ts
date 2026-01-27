import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { startOfDay, endOfDay } from "date-fns";

export const getSeatService = async (scheduleId: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    select: {
      id: true,
      trainId: true,
      departureTime: true,
      arrivalTime: true,
      price: true,
      train: {
        select: {
          name: true,
          code: true,
          totalSeats: true,
        },
      },
      route: {
        select: {
          originStation: { select: { name: true } },
          destinationStation: { select: { name: true } },
        },
      },
    },
  });

  if (!schedule) {
    throw new NotFoundError("Schedule not found");
  }

  const bookedSeatIds = new Set(
    (
      await prisma.bookingSeat.findMany({
        where: { scheduleId },
        select: { seatId: true },
      })
    ).map((s: any) => s.seatId),
  );

  const seats = await prisma.seat.findMany({
    where: { trainId: schedule.trainId },
    select: {
      id: true,
      number: true,
    },
    orderBy: { number: "asc" },
  });

  return {
    schedule: {
      id: schedule.id,
      train: schedule.train,
      origin: schedule.route.originStation.name,
      destination: schedule.route.destinationStation.name,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      price: schedule.price,
    },
    seats: seats.map((seat: any) => ({
      id: seat.id,
      number: seat.number,
      isAvailable: !bookedSeatIds.has(seat.id),
    })),
  };
};

export const getTrainSchedulesService = async (params: {
  from?: string;
  to?: string;
  date?: Date;
  passengers?: string;
}) => {
  const { from, to, date, passengers } = params;

  if (!from || !to || !date) {
    throw new Error("from, to, and date are required");
  }

  const passengerCount = passengers ? parseInt(passengers, 10) : undefined;

  const schedules = await prisma.schedule.findMany({
    where: {
      route: {
        originStation: {
          code: from,
        },
        destinationStation: {
          code: to,
        },
      },
      departureTime: {
        gte: startOfDay(new Date(date)),
        lte: endOfDay(new Date(date)),
      },
    },
    include: {
      train: true,
      route: {
        include: {
          originStation: true,
          destinationStation: true,
        },
      },
      _count: {
        select: {
          bookingSeats: true,
        },
      },
    },
    orderBy: {
      departureTime: "asc",
    },
  });

  const results = schedules
    .map((s: any) => {
      const availableSeats = s.train.totalSeats - s._count.bookingSeats;

      return {
        scheduleId: s.id,
        train: {
          name: s.train.name,
          code: s.train.code,
          totalSeats: s.train.totalSeats,
        },
        origin: {
          code: s.route.originStation.code,
          name: s.route.originStation.name,
        },
        destination: {
          code: s.route.destinationStation.code,
          name: s.route.destinationStation.name,
        },
        departureTime: s.departureTime,
        arrivalTime: s.arrivalTime,
        price: s.price,
        availableSeats,
      };
    })
    .filter((s: any) => {
      if (!passengerCount) return true;
      return s.availableSeats >= passengerCount;
    });

  return results;
};

export const getStationsService = async (params: string) => {
  const stations = await prisma.station.findMany({
    where: {
      name: {
        contains: params,
        mode: "insensitive",
      },
    },
    select: {
      name: true,
      code: true,
    },
  });

  return stations;
};
