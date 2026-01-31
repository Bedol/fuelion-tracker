import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useDeleteFueling } from '../../hooks';
import { toaster } from '../ui/toaster';

interface FuelingDeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	fueling: {
		id: number;
		date: string;
		cost: number;
	};
	currency: string;
	onDeleteSuccess: () => void;
	vehicleId: number;
}

const FuelingDeleteModal: React.FC<FuelingDeleteModalProps> = ({
	isOpen,
	onClose,
	fueling,
	currency,
	onDeleteSuccess,
	vehicleId,
}) => {
	const deleteMutation = useDeleteFueling();

	const handleDelete = () => {
		deleteMutation.mutate(
			{
				id: fueling.id,
				vehicleId,
			},
			{
				onSuccess: () => {
					onDeleteSuccess();
				},
			}
		);
	};

	const formattedDate = new Date(fueling.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

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
							<Dialog.Title>Delete Fueling Record?</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text mb='4'>
								Are you sure you want to delete the fueling record from{' '}
								<strong>
									{formattedDate} ({fueling.cost.toFixed(2)} {currency})
								</strong>
								?
							</Text>
							<Text color='red.600' fontSize='sm'>
								This action cannot be undone. Vehicle statistics will be
								recalculated.
							</Text>
						</Dialog.Body>
						<Dialog.Footer>
							<Button variant='outline' onClick={onClose}>
								Cancel
							</Button>
							<Button
								colorPalette='red'
								onClick={handleDelete}
								loading={deleteMutation.isPending}
								loadingText='Deleting...'
							>
								Delete
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger />
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

export default FuelingDeleteModal;
