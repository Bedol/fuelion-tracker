import { Fueling, PrismaPromise } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<PrismaPromise<Fueling[]> | {}>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      {
        const result = await prisma.fueling.create({
          data: body,
        });
        res.json(result);
      }
      break;
    case "GET":
      {
        const fueling = await prisma.fueling.findMany();
        res.json(fueling);
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
