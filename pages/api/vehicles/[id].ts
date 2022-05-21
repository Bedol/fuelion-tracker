import { NextApiRequest, NextApiResponse } from "next";
import {
  FuelType,
  Gearbox,
  MilageType,
  PowerUnit,
} from "../../../types/vehicle_types";

export default ({ query: { id } }: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    id: id,
    type: "passenger",
    brand: "Nissan",
    model: "Quashqai 2",
    production_year: 2019,
    engine_capacity: 1.3,
    fuel_type: FuelType.Gasoline,
    gearbox: Gearbox.Automatic,
    power: 130,
    power_unit: PowerUnit.HorsePower,
    milage_in: MilageType.Kilometers,
  });
};
