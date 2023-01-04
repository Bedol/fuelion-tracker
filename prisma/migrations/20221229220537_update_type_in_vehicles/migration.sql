/*
  Warnings:

  - You are about to drop the column `milage_in` on the `Vehicles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "milage_in",
ADD COLUMN     "mileage" INTEGER NOT NULL DEFAULT 0;
