import { NextApiRequest, NextApiResponse } from "next";
import {
  FuelType,
  Gearbox,
  MilageType,
  PowerUnit,
  VehicleData,
} from "../../../types/vehicle_types";

export default (req: NextApiRequest, resp: NextApiResponse<VehicleData[]>) => {
  resp.json([
    {
      id: 1,
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
    },
    {
      id: 2,
      type: "passenger",
      brand: "Renault",
      model: "Koleos",
      production_year: 2020,
      engine_capacity: 2.0,
      fuel_type: FuelType.Diesel,
      gearbox: Gearbox.Manual,
      power: 130,
      power_unit: PowerUnit.HorsePower,
      milage_in: MilageType.Kilometers,
    },
  ]);
};
