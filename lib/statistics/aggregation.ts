import {
	addMonths,
	endOfMonth,
	format,
	startOfMonth,
	subMonths,
} from 'date-fns';

import type {
	ConsumptionPoint,
	MonthlyCostPoint,
	StatisticsSummary,
	VehicleStatisticsResponse,
} from '../../types/statistics_types';

type FuelingInput = {
	date: string | Date;
	mileage: number;
	quantity: number;
	cost: number;
	full_tank: boolean;
};

type ConsumptionInterval = {
	endDate: Date;
	consumption: number;
	distance: number;
	fuel: number;
};

const toDate = (value: string | Date) => new Date(value);

const buildIntervals = (fuelings: FuelingInput[]): ConsumptionInterval[] => {
	const sorted = [...fuelings].sort((a, b) => a.mileage - b.mileage);
	const intervals: ConsumptionInterval[] = [];

	let lastFull: FuelingInput | null = null;
	let fuelSum = 0;

	sorted.forEach((fueling) => {
		fuelSum += fueling.quantity;

		if (fueling.full_tank) {
			if (lastFull) {
				const distance = fueling.mileage - lastFull.mileage;
				if (distance > 0) {
					intervals.push({
						endDate: toDate(fueling.date),
						consumption: (fuelSum / distance) * 100,
						distance,
						fuel: fuelSum,
					});
				}
			}

			lastFull = fueling;
			fuelSum = 0;
		}
	});

	return intervals;
};

const buildConsumptionSeries = (
	intervals: ConsumptionInterval[]
): ConsumptionPoint[] => {
	const grouped = new Map<
		string,
		{ total: number; count: number; date: Date }
	>();

	intervals.forEach((interval) => {
		const monthKey = format(new Date(interval.endDate), 'MMM yyyy');
		const existing = grouped.get(monthKey);
		if (existing) {
			existing.total += interval.consumption;
			existing.count += 1;
			return;
		}

		grouped.set(monthKey, {
			total: interval.consumption,
			count: 1,
			date: interval.endDate,
		});
	});

	return Array.from(grouped.entries())
		.sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
		.map(([month, data]) => ({
			month,
			value: data.total / data.count,
		}));
};

const buildMonthlyCosts = (fuelings: FuelingInput[]): MonthlyCostPoint[] => {
	if (fuelings.length === 0) {
		return [];
	}

	const latestDate = fuelings
		.map((fueling) => toDate(fueling.date))
		.reduce((maxDate, currentDate) =>
			currentDate > maxDate ? currentDate : maxDate
		);

	const windowStart = startOfMonth(subMonths(latestDate, 11));
	const windowEnd = endOfMonth(latestDate);
	const costsByMonth = new Map<string, number>();

	fuelings.forEach((fueling) => {
		const fuelingDate = toDate(fueling.date);
		if (fuelingDate < windowStart || fuelingDate > windowEnd) {
			return;
		}

		const monthKey = format(new Date(fuelingDate), 'MMM yyyy');
		const currentValue = costsByMonth.get(monthKey) ?? 0;
		costsByMonth.set(monthKey, currentValue + fueling.cost);
	});

	const results: MonthlyCostPoint[] = [];
	let cursor = windowStart;

	while (cursor <= windowEnd) {
		const monthKey = format(new Date(cursor), 'MMM yyyy');
		const value = costsByMonth.get(monthKey) ?? 0;
		if (value > 0) {
			results.push({ month: monthKey, value });
		}
		cursor = addMonths(cursor, 1);
	}

	return results;
};

export const buildVehicleStatistics = (
	fuelings: FuelingInput[]
): VehicleStatisticsResponse => {
	const intervals = buildIntervals(fuelings);
	const consumption = buildConsumptionSeries(intervals);
	const monthlyCosts = buildMonthlyCosts(fuelings);

	const totalSpent = fuelings.reduce((sum, fueling) => sum + fueling.cost, 0);
	const totalDistance = intervals.reduce(
		(sum, interval) => sum + interval.distance,
		0
	);
	const totalFuel = intervals.reduce(
		(sum, interval) => sum + interval.fuel,
		0
	);

	const hasConsumptionData = intervals.length > 0;
	const hasCostData = monthlyCosts.length > 0;

	const summary: StatisticsSummary = {
		totalSpent,
		averageConsumption:
			hasConsumptionData && totalDistance > 0
				? (totalFuel / totalDistance) * 100
				: null,
		totalDistance: hasConsumptionData && totalDistance > 0 ? totalDistance : null,
	};

	return {
		summary,
		consumption,
		monthlyCosts,
		hasConsumptionData,
		hasCostData,
	};
};
