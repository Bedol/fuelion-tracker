import { NextApiRequest, NextApiResponse } from "next";

export type VehicleData = {
  id: string;
  name: string;
  model: string;
  production_year: Number;
  capacity: Number;
  fuel_type: string;
};

export default (req: NextApiRequest, resp: NextApiResponse<VehicleData[]>) => {
  resp.json([
    {
      id: "1",
      name: "Nissan",
      model: "Quashqai 2",
      production_year: 2019,
      capacity: 1.3,
      fuel_type: "Petrol",
    },
    {
      id: "2",
      name: "Renault",
      model: "Koleos",
      production_year: 2020,
      capacity: 2.0,
      fuel_type: "Diesel",
    },
  ]);
};
