/*
  Warnings:

  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `filled_tank` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `tire_type` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `type_of_fuel` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Fueling` table. All the data in the column will be lost.
  - You are about to alter the column `country` on the `Fueling` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(2)`.
  - You are about to drop the `Vehicles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_id` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuel_type_id` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default_currency_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuel_unit_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Fueling" DROP CONSTRAINT "Fueling_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Fueling" DROP COLUMN "amount",
DROP COLUMN "currency",
DROP COLUMN "filled_tank",
DROP COLUMN "tire_type",
DROP COLUMN "type_of_fuel",
DROP COLUMN "vehicleId",
ADD COLUMN     "air_conditioning_value" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "cost_per_unit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "currency_id" INTEGER NOT NULL,
ADD COLUMN     "fuel_type_id" INTEGER NOT NULL,
ADD COLUMN     "full_tank" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "vehicle_id" INTEGER NOT NULL,
ALTER COLUMN "air_conditioning" SET DEFAULT false,
ALTER COLUMN "country" SET DATA TYPE VARCHAR(2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "default_country" VARCHAR(2),
ADD COLUMN     "default_currency_id" INTEGER NOT NULL,
ADD COLUMN     "default_region" VARCHAR(255),
ADD COLUMN     "favorite_station" VARCHAR(255),
ADD COLUMN     "fuel_unit_id" INTEGER NOT NULL,
ADD COLUMN     "profile_completed" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Vehicles";

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "brand_name" VARCHAR(255) NOT NULL,
    "model_name" VARCHAR(255) NOT NULL,
    "engine_capacity" INTEGER NOT NULL,
    "production_year" INTEGER NOT NULL,
    "fuel_type_id" INTEGER NOT NULL,
    "transmission" INTEGER NOT NULL,
    "engine_power" INTEGER NOT NULL,
    "power_unit_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "mileage_in_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "currency_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "type_id" INTEGER NOT NULL DEFAULT 1,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fueling" ADD CONSTRAINT "Fueling_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
