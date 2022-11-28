import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const handle = async (
  { query: { id } }: NextApiRequest,
  res: NextApiResponse
) => {
  const vehicle = await prisma.vehicles.findUnique({
    where: { id: id },
  });

  res.json(vehicle);
};

export default handle;
