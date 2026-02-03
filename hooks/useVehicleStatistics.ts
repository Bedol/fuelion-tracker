import { useQuery } from '@tanstack/react-query';
import { VehicleStatisticsResponse } from '../types/statistics_types';

export const useVehicleStatistics = (vehicleId?: number) => {
	return useQuery({
		queryKey: ['vehicleStatistics', vehicleId],
		queryFn: async () => {
			const response = await fetch(`/api/vehicles/${vehicleId}/statistics`);
			if (!response.ok) {
				throw new Error('Failed to fetch vehicle statistics');
			}
			return response.json() as Promise<VehicleStatisticsResponse>;
		},
		enabled: !!vehicleId,
	});
};
