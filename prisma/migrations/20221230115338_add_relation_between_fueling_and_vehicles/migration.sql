/*
  Warnings:

  - Added the required column `vehicleId` to the `Fueling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fueling" ADD COLUMN     "vehicleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Fueling" ADD CONSTRAINT "Fueling_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
