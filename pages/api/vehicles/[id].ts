import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const id: number = req.body.id;
  const vehicle = await prisma.vehicles.findUnique({
    where: { id: id },
  });

  res.json(vehicle);
};

export default handle;
