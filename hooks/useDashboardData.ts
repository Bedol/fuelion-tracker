import { useQuery } from '@tanstack/react-query';
import type { DashboardResponse } from '../types/dashboard_types';

export const useDashboardData = () => {
	return useQuery({
		queryKey: ['dashboard'],
		queryFn: async () => {
			const response = await fetch('/api/dashboard');
			if (!response.ok) {
				throw new Error('Failed to fetch dashboard data');
			}
			return response.json() as Promise<DashboardResponse>;
		},
		staleTime: 2 * 60 * 1000,
	});
};
