/*
  Warnings:

  - You are about to drop the column `type_of_fueling` on the `Fueling` table. All the data in the column will be lost.
  - The `type_of_fuel` column on the `Fueling` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Fueling" DROP COLUMN "type_of_fueling",
ADD COLUMN     "filled_tank" VARCHAR(255),
DROP COLUMN "type_of_fuel",
ADD COLUMN     "type_of_fuel" VARCHAR(255);

-- DropEnum
DROP TYPE "TypeOfFuel";

-- DropEnum
DROP TYPE "TypeOfFueling";
