import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (_req: NextApiRequest, resp: NextApiResponse) => {
  const allVehicles = prisma.vehicles.findMany();

  resp.json(allVehicles);
};
