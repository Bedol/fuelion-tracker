/*
  Warnings:

  - You are about to drop the column `engine_power` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `engine_power_id` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "engine_power",
ADD COLUMN     "engine_power_id" INTEGER NOT NULL;
