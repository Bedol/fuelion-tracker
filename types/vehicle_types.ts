export type VehicleData = {
	id: number;
	user_id: number;
	brand_name: string;
	model_name: string;
	production_year: number;
	fuel_type: string;
	registration_number?: string;
	engine_capacity?: number;
	engine_power?: number;
	power_unit?: string;
	vehicle_type?: string;
	transmission?: string;
	mileage: number;
	mileage_unit: string;
	currency: string;
	created_at: Date;
	updated_at: Date;
};

export type SelectOptionType = {
	id: number;
	name: string;
	value: string;
};

export type CurrencyType = {
	id: number;
	name: string;
	code: string;
};

// Updated to match Prisma schema values (lowercase strings)
export const fuelTypes: SelectOptionType[] = [
	{ id: 1, name: 'Gasoline', value: 'gasoline' },
	{ id: 2, name: 'Diesel', value: 'diesel' },
	{ id: 3, name: 'LPG', value: 'lpg' },
	{ id: 4, name: 'Electric', value: 'electric' },
	{ id: 5, name: 'Hybrid', value: 'hybrid' },
];

// Transmission options matching schema
export const transmissionTypes: SelectOptionType[] = [
	{ id: 1, name: 'Manual', value: 'manual' },
	{ id: 2, name: 'Automatic', value: 'automatic' },
];

// Power unit options matching schema
export const powerUnits: SelectOptionType[] = [
	{ id: 1, name: 'Horsepower (HP)', value: 'HP' },
	{ id: 2, name: 'Kilowatts (kW)', value: 'kW' },
];

export const currencies: CurrencyType[] = [
	{ id: 1, name: 'Polish Złoty', code: 'PLN' },
	{ id: 2, name: 'Euro', code: 'EUR' },
	{ id: 3, name: 'US Dollars', code: 'USD' },
];

// Enums kept for potential future use or reference
// These match the schema string values for consistency
export enum VehicleType {
	Car = 'car',
	Truck = 'truck',
	Motorcycle = 'motorcycle',
}

export enum FuelType {
	Gasoline = 'gasoline',
	Diesel = 'diesel',
	Lpg = 'lpg',
	Electric = 'electric',
	Hybrid = 'hybrid',
}

export enum Gearbox {
	Manual = 'manual',
	Automatic = 'automatic',
}

export enum PowerUnit {
	HorsePower = 'HP',
	KiloWatt = 'kW',
}

export enum MilageType {
	Miles = 'miles',
	Kilometers = 'kilometers',
}
