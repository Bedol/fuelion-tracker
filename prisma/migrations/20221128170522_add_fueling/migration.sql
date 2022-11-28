-- CreateTable
CREATE TABLE "Fueling" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "Fueling_pkey" PRIMARY KEY ("id")
);
