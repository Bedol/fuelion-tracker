-- CreateEnum
CREATE TYPE "TypeOfFuel" AS ENUM ('GASOLINE', 'DIESEL', 'LPG', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "TypeOfFueling" AS ENUM ('FULL', 'NOT_FULL');

-- AlterTable
ALTER TABLE "Fueling" ADD COLUMN     "air_conditioning" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "country" VARCHAR(255),
ADD COLUMN     "currency" VARCHAR(3),
ADD COLUMN     "date" DATE,
ADD COLUMN     "distance_traveled" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "mileage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "region" VARCHAR(255),
ADD COLUMN     "station" VARCHAR(255),
ADD COLUMN     "tire_type" VARCHAR(255),
ADD COLUMN     "type_of_fuel" "TypeOfFuel" NOT NULL DEFAULT E'GASOLINE',
ADD COLUMN     "type_of_fueling" "TypeOfFueling" NOT NULL DEFAULT E'FULL',
ALTER COLUMN "amount" SET DEFAULT 0.0,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cost" SET DEFAULT 0.0,
ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION;