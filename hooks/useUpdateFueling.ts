import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '../components/ui/toaster';
import { FuelingFormValues } from '../types/fueling_types';

export const useUpdateFueling = () => {
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
				const message = await getErrorMessage(
					response,
					'Failed to update fueling'
				);
				throw new Error(message);
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
			queryClient.invalidateQueries({
				queryKey: ['dashboard'],
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
