/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId,seatId]` on the table `BookingSeat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `BookingSeat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BookingSeat_seatId_bookingId_key";

-- AlterTable
ALTER TABLE "BookingSeat" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_scheduleId_seatId_key" ON "BookingSeat"("scheduleId", "seatId");

-- AddForeignKey
ALTER TABLE "BookingSeat" ADD CONSTRAINT "BookingSeat_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
