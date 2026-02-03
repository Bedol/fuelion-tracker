import {
	addMonths,
	endOfMonth,
	endOfYear,
	format,
	startOfMonth,
	startOfYear,
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
	startDate: Date;
	endDate: Date;
	consumption: number;
	distance: number;
	fuel: number;
};

type ConsumptionSegment = {
	month: string;
	date: Date;
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
						startDate: toDate(lastFull.date),
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

const splitIntervalForYear = (
	interval: ConsumptionInterval,
	selectedYear: number
): ConsumptionSegment[] => {
	const normalizedStart =
		interval.startDate <= interval.endDate
			? interval.startDate
			: interval.endDate;
	const normalizedEnd =
		interval.startDate <= interval.endDate
			? interval.endDate
			: interval.startDate;
	const yearStart = startOfYear(new Date(selectedYear, 0, 1));
	const yearEnd = endOfYear(new Date(selectedYear, 0, 1));

	if (normalizedEnd < yearStart || normalizedStart > yearEnd) {
		return [];
	}

	const clippedStart =
		normalizedStart > yearStart ? normalizedStart : yearStart;
	const clippedEnd = normalizedEnd < yearEnd ? normalizedEnd : yearEnd;
	const rawDuration = normalizedEnd.getTime() - normalizedStart.getTime();
	const safeDuration = rawDuration === 0 ? 1 : rawDuration;
	const segments: ConsumptionSegment[] = [];

	let cursor = startOfMonth(clippedStart);
	while (cursor <= clippedEnd) {
		const monthStart = startOfMonth(cursor);
		const monthEnd = endOfMonth(cursor);
		const segmentStart = clippedStart > monthStart ? clippedStart : monthStart;
		const segmentEnd = clippedEnd < monthEnd ? clippedEnd : monthEnd;
		const segmentDurationRaw = segmentEnd.getTime() - segmentStart.getTime();
		const segmentDuration =
			segmentDurationRaw === 0 ? safeDuration : segmentDurationRaw;

		if (segmentDuration > 0) {
			const share = segmentDuration / safeDuration;
			segments.push({
				month: format(new Date(segmentEnd), 'MMM yyyy'),
				date: segmentEnd,
				consumption: interval.consumption,
				distance: interval.distance * share,
				fuel: interval.fuel * share,
			});
		}
		cursor = addMonths(cursor, 1);
	}

	return segments;
};

const buildConsumptionSegments = (
	intervals: ConsumptionInterval[],
	selectedYear: number | null
): ConsumptionSegment[] => {
	if (!selectedYear) {
		return [];
	}

	return intervals.flatMap((interval) =>
		splitIntervalForYear(interval, selectedYear)
	);
};

const buildConsumptionSeries = (
	segments: ConsumptionSegment[]
): ConsumptionPoint[] => {
	const grouped = new Map<
		string,
		{ total: number; count: number; date: Date }
	>();

	segments.forEach((segment) => {
		const existing = grouped.get(segment.month);
		if (existing) {
			existing.total += segment.consumption;
			existing.count += 1;
			return;
		}

		grouped.set(segment.month, {
			total: segment.consumption,
			count: 1,
			date: segment.date,
		});
	});

	return Array.from(grouped.entries())
		.sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
		.map(([month, data]) => ({
			month,
			value: data.total / data.count,
		}));
};

const buildMonthlyCosts = (
	fuelings: FuelingInput[],
	selectedYear: number | null
): MonthlyCostPoint[] => {
	if (fuelings.length === 0 || !selectedYear) {
		return [];
	}

	const windowStart = startOfYear(new Date(selectedYear, 0, 1));
	const windowEnd = endOfYear(new Date(selectedYear, 0, 1));
	const costsByMonth = new Map<string, number>();

	fuelings.forEach((fueling) => {
		const fuelingDate = toDate(fueling.date);
		if (fuelingDate.getFullYear() !== selectedYear) {
			return;
		}
		if (fuelingDate < windowStart || fuelingDate > windowEnd) {
			return;
		}

		const monthKey = format(new Date(fuelingDate), 'MMM yyyy');
		const currentValue = costsByMonth.get(monthKey) ?? 0;
		costsByMonth.set(monthKey, currentValue + fueling.cost);
	});

	const results: MonthlyCostPoint[] = [];
	let cursor = startOfMonth(windowStart);

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

const buildAvailableYears = (fuelings: FuelingInput[]): number[] => {
	const years = new Set<number>();
	fuelings.forEach((fueling) => {
		years.add(toDate(fueling.date).getFullYear());
	});

	return Array.from(years).sort((a, b) => b - a);
};

export const buildVehicleStatistics = (
	fuelings: FuelingInput[],
	requestedYear?: number | null
): VehicleStatisticsResponse => {
	const availableYears = buildAvailableYears(fuelings);
	const selectedYear = availableYears.length
		? requestedYear && availableYears.includes(requestedYear)
			? requestedYear
			: availableYears[0]
		: null;

	const fuelingsForYear = selectedYear
		? fuelings.filter(
				(fueling) => toDate(fueling.date).getFullYear() === selectedYear
			)
		: [];

	const allIntervals = buildIntervals(fuelings);
	const consumptionSegments = buildConsumptionSegments(
		allIntervals,
		selectedYear
	);
	const consumption = buildConsumptionSeries(consumptionSegments);
	const monthlyCosts = buildMonthlyCosts(fuelingsForYear, selectedYear);

	const totalSpent = fuelingsForYear.reduce(
		(sum, fueling) => sum + fueling.cost,
		0
	);
	const totalDistance = consumptionSegments.reduce(
		(sum, segment) => sum + segment.distance,
		0
	);
	const totalFuel = consumptionSegments.reduce(
		(sum, segment) => sum + segment.fuel,
		0
	);

	const hasConsumptionData = consumptionSegments.length > 0;
	const hasCostData = monthlyCosts.length > 0;

	const summary: StatisticsSummary = {
		totalSpent,
		averageConsumption:
			hasConsumptionData && totalDistance > 0
				? (totalFuel / totalDistance) * 100
				: null,
		totalDistance:
			hasConsumptionData && totalDistance > 0 ? totalDistance : null,
	};

	return {
		summary,
		consumption,
		monthlyCosts,
		hasConsumptionData,
		hasCostData,
		availableYears,
		selectedYear,
	};
};
