import { useQuery } from '@tanstack/react-query';
import { FuelingData } from '../types/fueling_types';

export const useLastFuelingData = (vehicleId: number) => {
	return useQuery({
		queryKey: ['lastFueling', vehicleId],
		queryFn: async () => {
			const response = await fetch(`/api/fueling/last?vehicleId=${vehicleId}`);
			if (response.status === 404) {
				return null;
			}
			if (!response.ok) {
				throw new Error('Failed to fetch last fueling data');
			}
			return response.json() as Promise<FuelingData>;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!vehicleId,
	});
};
