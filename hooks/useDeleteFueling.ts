import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '../components/ui/toaster';

export const useDeleteFueling = () => {
	const queryClient = useQueryClient();

	const getErrorMessage = async (response: Response, fallback: string) => {
		const errorData = await response.json().catch(() => null);
		if (errorData && typeof errorData === 'object') {
			const message = (errorData as { error?: { message?: string } }).error
				?.message;
			if (typeof message === 'string' && message.trim()) {
				return message;
			}

			const legacyMessage = (errorData as { message?: string }).message;
			if (typeof legacyMessage === 'string' && legacyMessage.trim()) {
				return legacyMessage;
			}
		}

		return fallback;
	};

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
				const message = await getErrorMessage(
					response,
					'Failed to delete fueling'
				);
				throw new Error(message);
			}

			// DELETE returns 204 No Content (no body to parse)
			return null;
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
			queryClient.invalidateQueries({
				queryKey: ['dashboard'],
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
