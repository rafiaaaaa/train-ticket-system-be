import { Router } from "express";
import { createBookingPayment } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate";
import { payBookingSchema } from "./payment.schema";

const route = Router();

route.post(
  "/",
  authMiddleware,
  validate(payBookingSchema),
  createBookingPayment
);

export default route;
