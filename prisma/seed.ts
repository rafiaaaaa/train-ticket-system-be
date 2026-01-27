import { prisma } from "../src/lib/prisma";
import { bcryptHash } from "../src/utils/bcrypt";

const USER_ID = "11111111-1111-4111-8111-111111111111";

/* ================= STATIONS ================= */
const STATIONS = [
  { code: "JKT", name: "Jakarta", city: "Jakarta" },
  { code: "BDG", name: "Bandung", city: "Bandung" },
  { code: "CBN", name: "Cirebon", city: "Cirebon" },
  { code: "SMG", name: "Semarang", city: "Semarang" },
  { code: "YGY", name: "Yogyakarta", city: "Yogyakarta" },
  { code: "SOC", name: "Solo", city: "Surakarta" },
  { code: "SBY", name: "Surabaya", city: "Surabaya" },
  { code: "MLG", name: "Malang", city: "Malang" },
];

async function seed() {
  /* ================= USER ================= */
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: {
      id: USER_ID,
      email: "test@example.com",
      password: await bcryptHash("password"),
      first_name: "Demo",
      last_name: "User",
    },
  });

  /* ================= STATION ================= */
  const stationMap: Record<string, string> = {};

  for (const station of STATIONS) {
    const result = await prisma.station.upsert({
      where: { code: station.code },
      update: {},
      create: station,
    });
    stationMap[station.code] = result.id;
  }

  /* ================= ROUTES (ALL COMBINATIONS) ================= */
  const routes = [];

  for (const from of STATIONS) {
    for (const to of STATIONS) {
      if (from.code !== to.code) {
        routes.push({
          id: crypto.randomUUID(),
          originStationId: stationMap[from.code]!,
          destinationStationId: stationMap[to.code]!,
        });
      }
    }
  }

  await prisma.route.createMany({ data: routes });

  /* ================= TRAINS ================= */
  const TRAIN_COUNT = 10;
  const SEATS_PER_TRAIN = 30;
  const ROWS = ["A", "B", "C", "D", "E", "F"];

  const allRoutes = await prisma.route.findMany();

  for (let i = 1; i <= TRAIN_COUNT; i++) {
    const trainId = crypto.randomUUID();

    await prisma.train.create({
      data: {
        id: trainId,
        name: `Argo Nusantara ${i}`,
        code: `ARGO-${i.toString().padStart(2, "0")}`,
        totalSeats: SEATS_PER_TRAIN,
      },
    });

    /* ===== SEATS ===== */
    const seats = [];

    for (const row of ROWS) {
      for (let n = 1; n <= 5; n++) {
        seats.push({
          id: crypto.randomUUID(),
          trainId,
          number: `${row}${n}`,
        });
      }
    }

    await prisma.seat.createMany({ data: seats });

    /* ===== SCHEDULE (random route) ===== */
    const route = allRoutes[Math.floor(Math.random() * allRoutes.length)]!;

    await prisma.schedule.create({
      data: {
        id: crypto.randomUUID(),
        trainId,
        routeId: route.id,
        departureTime: new Date(
          `2026-01-${(i + 5).toString().padStart(2, "0")}T08:00:00Z`,
        ),
        arrivalTime: new Date(
          `2026-01-${(i + 5).toString().padStart(2, "0")}T12:00:00Z`,
        ),
        price: 180000 + i * 15000,
      },
    });
  }

  console.log("✅ SEED DONE — MULTI STATION, MULTI ROUTE, 10 TRAINS");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
