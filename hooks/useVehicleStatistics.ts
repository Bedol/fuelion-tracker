import { useQuery } from '@tanstack/react-query';
import { VehicleStatisticsResponse } from '../types/statistics_types';

export const useVehicleStatistics = (
	vehicleId?: number,
	year?: number | null
) => {
	return useQuery({
		queryKey: ['vehicleStatistics', vehicleId, year ?? null],
		queryFn: async () => {
			const yearParam = typeof year === 'number' ? `?year=${year}` : '';
			const response = await fetch(
				`/api/vehicles/${vehicleId}/statistics${yearParam}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch vehicle statistics');
			}
			return response.json() as Promise<VehicleStatisticsResponse>;
		},
		enabled: !!vehicleId,
	});
};
