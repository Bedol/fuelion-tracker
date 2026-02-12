export type DashboardVehicleSummary = {
	id: number;
	brandName: string;
	modelName: string;
	registrationNumber: string | null;
	fuelType: string;
	currency: string;
	totalSpent: number;
	averageConsumption: number;
	totalDistance: number;
	lastFuelingDate: string | null;
};

export type DashboardActivityItem = {
	vehicleId: number;
	vehicleLabel: string;
	registrationNumber: string | null;
	currency: string;
	date: string | null;
	cost: number;
	quantity: number;
	mileage: number;
};

export type DashboardResponse = {
	vehicles: DashboardVehicleSummary[];
	recentActivity: DashboardActivityItem[];
};
