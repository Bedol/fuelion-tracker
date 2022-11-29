import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
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
