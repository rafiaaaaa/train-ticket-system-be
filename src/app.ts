import express from "express";
import cors from "cors";
import routes from "./routes/index.route";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import cron from "node-cron";
import { expireBookings } from "./features/booking/jobs/expire-booking.job";

const app = express();
console.log("NODE_ENV:", process.env.FE_URL!.split(","));
app.use(
  cors({
    origin: process.env.FE_URL!.split(","),
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));
app.use(routes);

app.use(errorHandler);
cron.schedule("* * * * *", expireBookings);
console.log("NODE_ENV:", process.env.NODE_ENV);

export default app;
