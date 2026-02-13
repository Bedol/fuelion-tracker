import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useLocale } from '../../contexts/LocaleContext';
import { useDeleteFueling } from '../../hooks';

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
	const { locale, t } = useLocale();
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

	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';
	const formattedDate = new Date(fueling.date).toLocaleDateString(localeCode, {
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
							<Dialog.Title>{t('fuelings.deleteModal.title')}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text mb='4'>
								{t('fuelings.deleteModal.confirmPrefix')}{' '}
								<strong>
									{formattedDate} ({fueling.cost.toFixed(2)} {currency})
								</strong>
								?
							</Text>
							<Text color='red.600' fontSize='sm'>
								{t('fuelings.deleteModal.warning')}
							</Text>
						</Dialog.Body>
						<Dialog.Footer>
							<Button variant='outline' onClick={onClose}>
								{t('fuelings.deleteModal.cancel')}
							</Button>
							<Button
								colorPalette='red'
								onClick={handleDelete}
								loading={deleteMutation.isPending}
								loadingText={t('fuelings.deleteModal.deleting')}
							>
								{t('fuelings.deleteModal.confirm')}
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
