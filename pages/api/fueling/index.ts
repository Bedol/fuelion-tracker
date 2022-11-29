import { Fueling, PrismaPromise } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<PrismaPromise<Fueling[]> | {}>
) {
  const {
    cost,
    amount,
    country,
    date,
    region,
    station,
    currency,
    distance_traveled,
    mileage,
  } = req.body;

  const result = await prisma.fueling.create({
    data: {
      cost,
      amount,
      country,
      date,
      region,
      station,
      currency,
      distance_traveled,
      mileage,
    },
  });

  res.json(result);
}
