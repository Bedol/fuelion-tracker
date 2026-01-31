import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '../components/ui/toaster';
import { FuelingFormValues } from '../types/fueling_types';

export const useCreateFueling = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			data,
			vehicleId,
		}: {
			data: FuelingFormValues;
			vehicleId: number;
		}) => {
			const response = await fetch('/api/fueling', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to create fueling');
			}

			return response.json();
		},
		onSuccess: (_, variables) => {
			toaster.create({
				type: 'success',
				title: 'Fueling added',
				description: 'Record saved successfully.',
			});

			// Invalidate queries to refresh data
			queryClient.invalidateQueries({
				queryKey: ['fuelings', variables.vehicleId],
			});
			queryClient.invalidateQueries({
				queryKey: ['lastFueling', variables.vehicleId],
			});
		},
		onError: (error: Error) => {
			toaster.create({
				type: 'error',
				title: 'Failed to add fueling',
				description: error.message || 'Please try again.',
			});
		},
	});
};
