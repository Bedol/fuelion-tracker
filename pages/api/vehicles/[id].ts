import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const handle = async (
  { query: { id } }: NextApiRequest,
  res: NextApiResponse
) => {
  const vehicle = await prisma.vehicles.findUnique({
    where: { id: id.toString() },
  });

  res.json(vehicle);
};

export default handle;
