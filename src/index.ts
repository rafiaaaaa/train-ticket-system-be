import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.get("/", async (_req, res) => {
  // test prisma hidup
  const result = await prisma.$queryRaw`SELECT 1`;
  res.json({
    status: "ok",
    prisma: "connected",
    result,
  });
});

// ⚠️ penting: ini boleh ADA di Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 running on http://localhost:${port}`);
});

export default app;
