import { PrismaPromise, Vehicles } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const handle = async (
  req: NextApiRequest,
  res: NextApiResponse<
    | PrismaPromise<Vehicles[]>
    | Omit<Vehicles, "id" | "created_at" | "updated_at">
    | {}
  >
) => {
  const { method, body } = req;

  switch (method) {
    case "POST":
      {
        const result = await prisma.vehicles.create({
          data: body,
        });
        res.json(result);
      }
      break;
    case "GET":
      {
        const vehicles = await prisma.vehicles.findMany();
        res.json(vehicles);
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handle;
