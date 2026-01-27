import { Router } from "express";
import { getSeats, getStations, getTrainSchedules } from "./train.controller";

const router = Router();

router.get("/schedules", getTrainSchedules);
router.get("/schedules/:scheduleId/seats", getSeats);
router.get("/stations", getStations);

export default router;
