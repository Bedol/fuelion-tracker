export type StatisticsSummary = {
	totalSpent: number;
	averageConsumption: number | null;
	totalDistance: number | null;
};

export type ConsumptionPoint = {
	month: string;
	value: number;
};

export type MonthlyCostPoint = {
	month: string;
	value: number;
};

export type VehicleStatisticsResponse = {
	summary: StatisticsSummary;
	consumption: ConsumptionPoint[];
	monthlyCosts: MonthlyCostPoint[];
	hasConsumptionData: boolean;
	hasCostData: boolean;
	availableYears: number[];
	selectedYear: number | null;
};
