import { PrismaPromise, Vehicles } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const handle = async (
  _req: NextApiRequest,
  resp: NextApiResponse<PrismaPromise<Vehicles[]> | {}>
) => {
  const vehicles = await prisma.vehicles.findMany();

  resp.json({ vehicles });
};

export default handle;
