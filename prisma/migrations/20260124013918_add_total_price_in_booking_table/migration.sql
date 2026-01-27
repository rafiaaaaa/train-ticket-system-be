/*
  Warnings:

  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE INDEX "Schedule_departureTime_idx" ON "Schedule"("departureTime");
