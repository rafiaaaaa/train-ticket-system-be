/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER;
