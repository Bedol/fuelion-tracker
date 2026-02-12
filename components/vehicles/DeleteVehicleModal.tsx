import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from '../../contexts/LocaleContext';
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
	const { t } = useLocale();
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async () => {
			const resp = await fetch(`/api/vehicles/${vehicle.id}`, {
				method: 'DELETE',
			});
			if (!resp.ok) {
				const errorData = await resp.json().catch(() => ({}));
				throw new Error(
					errorData.message || t('vehicles.deleteModal.errors.deleteFailed')
				);
			}
			return resp.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			toaster.create({
				title: t('vehicles.deleteModal.toasts.successTitle'),
				description: `${vehicle.brand_name} ${vehicle.model_name} ${t(
					'vehicles.deleteModal.toasts.successDescriptionSuffix'
				)}`,
				type: 'success',
			});
			onClose();
			onDeleteSuccess();
		},
		onError: (error: Error) => {
			toaster.create({
				title: t('vehicles.deleteModal.toasts.errorTitle'),
				description:
					error.message || t('vehicles.deleteModal.toasts.errorDescription'),
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
				{/* @ts-ignore - Chakra v3 Dialog types have JSX children issues but work at runtime */}
				<Dialog.Positioner>
					{/* @ts-ignore */}
					<Dialog.Content>
						{/* @ts-ignore */}
						<Dialog.Header>
							{/* @ts-ignore */}
							<Dialog.Title>{t('vehicles.deleteModal.title')}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text mb='4'>
								{t('vehicles.deleteModal.confirmPrefix')}{' '}
								<strong>
									{vehicle.brand_name} {vehicle.model_name} (
									{vehicle.production_year})
								</strong>
								?
							</Text>
							<Text color='red.600' fontSize='sm'>
								{t('vehicles.deleteModal.warning')}
							</Text>
						</Dialog.Body>
						<Dialog.Footer>
							<Button variant='outline' onClick={onClose}>
								{t('vehicles.deleteModal.cancel')}
							</Button>
							<Button
								colorPalette='red'
								onClick={handleDelete}
								loading={deleteMutation.isPending}
								loadingText={t('vehicles.deleteModal.deleting')}
							>
								{t('vehicles.deleteModal.confirm')}
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger />
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

export default DeleteVehicleModal;
