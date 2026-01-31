import { useInfiniteQuery } from '@tanstack/react-query';
import { FuelingData } from '../types/fueling_types';

export const FUELINGS_PER_PAGE = 20;

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
			return response.json() as Promise<FuelingData[]>;
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
