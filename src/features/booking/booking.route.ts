import { Router } from "express";
import {
  createBookingController,
  getBookingController,
} from "./booking.controller";
import { validate } from "../../middlewares/validate";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createBookingSchema } from "./booking.schema";

const router = Router();

router.get("/:bookingId", authMiddleware, getBookingController);
router.post(
  "/",
  authMiddleware,
  validate(createBookingSchema),
  createBookingController,
);

export default router;
