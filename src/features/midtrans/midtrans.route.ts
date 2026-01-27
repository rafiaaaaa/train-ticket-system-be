import { Router } from "express";
import { midtransWebhook } from "./midtrans.controller";

const router = Router();

router.post("/webhook", midtransWebhook);

export default router;
