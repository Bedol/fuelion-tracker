import { PrismaClient, PrismaPromise, Vehicles } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (
  _req: NextApiRequest,
  resp: NextApiResponse<PrismaPromise<Vehicles[]> | {}>
) => {
  const allVehicles = await prisma.vehicles.findMany();

  resp.json(allVehicles);
};
