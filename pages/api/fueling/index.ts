import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { cost, amount } = req.body;

  const result = await prisma.fueling.create({
    data: {
      cost: cost,
      amount: amount,
    },
  });

  res.json(result);
}
