import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '../components/ui/toaster';

export const useDeleteFueling = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			vehicleId,
		}: {
			id: number;
			vehicleId: number;
		}) => {
			const response = await fetch(`/api/fueling/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to delete fueling');
			}

			return response.json();
		},
		onSuccess: (_, variables) => {
			toaster.create({
				type: 'success',
				title: 'Fueling deleted',
				description: 'Record removed.',
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
				title: 'Failed to delete',
				description: error.message || 'Please try again.',
			});
		},
	});
};
