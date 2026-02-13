import { useInfiniteQuery } from '@tanstack/react-query';
import { FuelingData } from '../types/fueling_types';

export const FUELINGS_PER_PAGE = 20;

const fuelTypeById: Record<number, string> = {
	1: 'gasoline',
	2: 'diesel',
	3: 'lpg',
	4: 'electric',
	5: 'hybrid',
};

type FuelingApiItem = FuelingData & {
	fuel_type_id?: number;
	fuel_type?: string | null;
};

export const useFuelings = (vehicleId: number) => {
	return useInfiniteQuery({
		queryKey: ['fuelings', vehicleId],
		queryFn: async ({ pageParam = 0 }) => {
			const response = await fetch(
				`/api/fueling?vehicleId=${vehicleId}&skip=${pageParam}&take=${FUELINGS_PER_PAGE}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch fuelings');
			}

			const rawData = (await response.json()) as FuelingApiItem[];

			return rawData.map((fueling) => {
				const normalizedFuelType =
					typeof fueling.fuel_type === 'string' &&
					fueling.fuel_type.trim() !== ''
						? fueling.fuel_type
						: fuelTypeById[fueling.fuel_type_id || 0] || 'gasoline';

				return {
					...fueling,
					fuel_type: normalizedFuelType,
				} as FuelingData;
			});
		},
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length === FUELINGS_PER_PAGE) {
				return allPages.length * FUELINGS_PER_PAGE;
			}
			return undefined;
		},
		initialPageParam: 0,
		enabled: !!vehicleId,
	});
};
