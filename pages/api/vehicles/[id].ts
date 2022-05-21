import { NextApiRequest, NextApiResponse } from "next";

export default async (
  { query: { id } }: NextApiRequest,
  res: NextApiResponse
) => {
  const vehicle = await prisma.vehicles.findUnique({
    where: { id: id.toString() },
  });

  res.json(vehicle);
};
