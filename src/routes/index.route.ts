import { Router, Response, Request } from "express";
import bookingRoutes from "../features/booking/booking.route";
import authRoutes from "../features/auth/auth.route";
import paymentRoutes from "../features/payment/payment.route";
import trainRoutes from "../features/train/train.route";
import midtransRoutes from "../features/midtrans/midtrans.route";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Train Ticket System API is running ✅");
});
router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payment", paymentRoutes);
router.use("/train", trainRoutes);
router.use("/midtrans", midtransRoutes);

export default router;
