export type VehicleData = {
	id: number;
	type: string;
	brand: string;
	model: string;
	production_year: Number;
	engine_capacity: Number;
	fuel_type: string;
	gearbox: string;
	power: number;
	power_unit: string;
	milage_in: string;
	registration_number?: string;
};

// Temporary disable those enums - no-unused-vars
/* eslint-disable */
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
/* eslint-enable */
