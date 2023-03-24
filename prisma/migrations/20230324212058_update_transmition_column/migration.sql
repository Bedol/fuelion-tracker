/*
  Warnings:

  - You are about to drop the column `transmission` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `transmission_id` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "transmission",
ADD COLUMN     "transmission_id" INTEGER NOT NULL;
