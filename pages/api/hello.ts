// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

type HelloData = {
  name: string;
};

export default (req: NextApiRequest, res: NextApiResponse<HelloData>) => {
  res.status(200).json({ name: "John Doe" });
};
