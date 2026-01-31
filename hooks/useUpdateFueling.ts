import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '../components/ui/toaster';
import { FuelingFormValues } from '../types/fueling_types';

export const useUpdateFueling = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
			vehicleId,
		}: {
			id: number;
			data: FuelingFormValues;
			vehicleId: number;
		}) => {
			const response = await fetch(`/api/fueling/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to update fueling');
			}

			return response.json();
		},
		onSuccess: (_, variables) => {
			toaster.create({
				type: 'success',
				title: 'Fueling updated',
				description: 'Changes saved.',
			});

			// Invalidate queries to refresh data
			queryClient.invalidateQueries({
				queryKey: ['fuelings', variables.vehicleId],
			});
		},
		onError: (error: Error) => {
			toaster.create({
				type: 'error',
				title: 'Failed to update',
				description: error.message || 'Please try again.',
			});
		},
	});
};
