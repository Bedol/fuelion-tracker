export type VehicleData = {
	id: number;
	type: string;
	brand: string;
	model: string;
	production_year: number;
	engine_capacity: number;
	fuel_type: string;
	gearbox: string;
	power: number;
	power_unit: string;
	milage_in: string;
	registration_number?: string;
};

export type SelectOptionType = {
  id: number
  name: string
  value: string
}

export type CurrencyType = {
  id: number
  name: string
  code: string
}

export const fuelTypes: SelectOptionType[] = [
  { id: 1, name: 'Benzine', value: 'BENZINE' },
  { id: 2, name: 'Diesel', value: 'DIESEL' },
  { id: 3, name: 'LPG', value: 'LPG' },
  { id: 4, name: 'Electric', value: 'EV' }
]

export const currencies: CurrencyType[] = [
  { id: 1, name: 'Polish Złoty', code: 'PLN' },
  { id: 2, name: 'Euro', code: 'EUR' },
  { id: 3, name: 'US Dollars', code: 'USD' }
]


// Temporary disable those enums - no-unused-vars
 
export enum VehicleType {
	Passenger = 'passenger',
	Truck = 'truck',
	MotorCycle = 'motor_cycle',
}

export enum FuelType {
	Gasoline = 'gasoline',
	Diesel = 'diesel',
	Lpg = 'lpg',
	Cng = 'cng',
	Electric = 'electric',
}

export enum Gearbox {
	Manual = 'manual',
	Automatic = 'automatic',
	SemiAutomatic = 'semi-automatic',
}

export enum PowerUnit {
	HorsePower = 'horse-power',
	KiloWatt = 'kilowatt',
}

export enum MilageType {
	Miles = 'miles',
	Kilometers = 'kilometers',
}
 
