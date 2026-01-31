import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { toaster } from '../ui/toaster';

type DeleteVehicleModalProps = {
	isOpen: boolean;
	onClose: () => void;
	vehicle: {
		id: number;
		brand_name: string;
		model_name: string;
		production_year: number;
	};
	onDeleteSuccess: () => void;
};

const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = ({
	isOpen,
	onClose,
	vehicle,
	onDeleteSuccess,
}) => {
	const deleteMutation = useMutation({
		mutationFn: async () => {
			const resp = await fetch(`/api/vehicles/${vehicle.id}`, {
				method: 'DELETE',
			});
			if (!resp.ok) {
				const errorData = await resp.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to delete vehicle');
			}
			return resp.json();
		},
		onSuccess: () => {
			toaster.create({
				title: 'Vehicle deleted successfully',
				description: `${vehicle.brand_name} ${vehicle.model_name} has been removed.`,
				type: 'success',
			});
			onClose();
			onDeleteSuccess();
		},
		onError: (error: Error) => {
			toaster.create({
				title: 'Failed to delete vehicle',
				description: error.message || 'Please try again later.',
				type: 'error',
			});
		},
	});

	const handleDelete = () => {
		deleteMutation.mutate();
	};

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={(details) => !details.open && onClose()}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Delete Vehicle?</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text mb='4'>
								Are you sure you want to delete{' '}
								<strong>
									{vehicle.brand_name} {vehicle.model_name} (
									{vehicle.production_year})
								</strong>
								?
							</Text>
							<Text color='red.600' fontSize='sm'>
								This vehicle and all its fueling records will be permanently
								deleted. This action cannot be undone.
							</Text>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant='outline' onClick={onClose}>
									Cancel
								</Button>
							</Dialog.ActionTrigger>
							<Button
								colorScheme='red'
								onClick={handleDelete}
								loading={deleteMutation.isPending}
								loadingText='Deleting...'
							>
								Delete Vehicle
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<Button
								position='absolute'
								top='2'
								right='2'
								size='sm'
								variant='ghost'
								onClick={onClose}
							>
								✕
							</Button>
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

export default DeleteVehicleModal;
