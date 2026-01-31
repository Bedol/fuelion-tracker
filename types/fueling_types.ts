export type FuelingData = {
	id: number;
	quantity: number;
	cost: number;
	cost_per_unit: number;
	date: string;
	mileage: number;
	fuel_type: string;
	full_tank: boolean;
	vehicle_id: number;
	created_at?: Date;
};

export type FuelingFormValues = {
	cost: string;
	quantity: string;
	cost_per_unit: number;
	mileage: string;
	date: string;
	full_tank: boolean;
	fuel_type: string;
	vehicle_id: number;
	last_odometer?: number;
};

export type GroupedFuelings = Record<string, FuelingData[]>;

export type FuelTypeOption = {
	id: number;
	name: string;
	value: string;
};

// Fuel type options matching vehicle_types.ts
export const fuelTypeOptions: FuelTypeOption[] = [
	{ id: 1, name: 'Gasoline', value: 'gasoline' },
	{ id: 2, name: 'Diesel', value: 'diesel' },
	{ id: 3, name: 'LPG', value: 'lpg' },
	{ id: 4, name: 'Electric', value: 'electric' },
	{ id: 5, name: 'Hybrid', value: 'hybrid' },
];
