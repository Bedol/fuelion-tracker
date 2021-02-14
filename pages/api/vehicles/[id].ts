import { NextApiRequest, NextApiResponse } from "next";

export default ({ query: { id } }: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    id: id,
    name: "Nissan",
    model: "Quashqai 2",
    production_year: 2019,
    capacity: 1.3,
    fuel_type: "Petrol",
  });
};
