import { Vehicles } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse<Vehicles>) => {
  const { id } = req.query;
  const vehicle = await prisma.vehicles.findUnique({
    where: { id: parseInt(id as string) },
  });

  res.json(vehicle);
};

export default handle;
