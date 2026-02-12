import { Badge, Box, HStack, IconButton, Stack, Text } from '@chakra-ui/react';
import { useLocale } from '../../contexts/LocaleContext';
import { FuelingData } from '../../types';

interface FuelingListItemProps {
	fueling: FuelingData;
	currency: string;
	density?: 'comfortable' | 'compact';
	onEdit?: () => void;
	onDelete?: () => void;
}

const FuelingListItem: React.FC<FuelingListItemProps> = ({
	fueling,
	currency,
	density = 'comfortable',
	onEdit,
	onDelete,
}) => {
	const { locale, t } = useLocale();
	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';
	const formattedDate = new Date(fueling.date).toLocaleDateString(localeCode, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
	const isPartialTank = !fueling.full_tank;
	const translatedFuelType = t(`vehicles.fuelTypes.${fueling.fuel_type}`);
	const fuelTypeLabel = translatedFuelType.startsWith('vehicles.fuelTypes.')
		? fueling.fuel_type
		: translatedFuelType;
	const isCompact = density === 'compact';

	return (
		<Box
			p={isCompact ? '2' : '3'}
			borderWidth='1px'
			borderRadius='lg'
			borderColor={isPartialTank ? 'orange.300' : 'gray.200'}
			bg={isPartialTank ? 'orange.50' : 'white'}
			_hover={{ shadow: 'xs' }}
			transition='all 0.2s'
		>
			<Stack
				direction={{ base: 'column', md: 'row' }}
				justify='space-between'
				align={{ base: 'flex-start', md: 'center' }}
				gap={isCompact ? '2' : '3'}
			>
				<Box flex='1'>
					<HStack gap='2' wrap='wrap' mb={isCompact ? '0.5' : '1'}>
						<Text fontWeight='semibold' fontSize={isCompact ? 'xs' : 'sm'}>
							{formattedDate}
						</Text>
						{isPartialTank ? (
							<Badge colorPalette='orange' size='sm' variant='solid'>
								{t('fuelings.item.partialTank')}
							</Badge>
						) : (
							<Badge colorPalette='green' size='sm' variant='subtle'>
								{t('fuelings.item.fullTank')}
							</Badge>
						)}
						<Badge
							colorPalette='gray'
							size='sm'
							variant='outline'
							textTransform='capitalize'
						>
							{fuelTypeLabel}
						</Badge>
					</HStack>
					<Text fontSize={isCompact ? 'xs' : 'sm'} color='gray.500'>
						{fueling.quantity.toFixed(2)} L @ {fueling.cost_per_unit.toFixed(3)}{' '}
						{currency}/L • {t('fuelings.item.odometer')}:{' '}
						{fueling.mileage.toLocaleString(localeCode)}
					</Text>
				</Box>

				<Stack
					direction='row'
					align='center'
					justify='space-between'
					w={{ base: 'full', md: 'auto' }}
					gap={isCompact ? '1' : '2'}
				>
					<Text
						fontSize={isCompact ? 'sm' : 'md'}
						fontWeight='bold'
						color='blue.600'
					>
						{fueling.cost.toFixed(2)} {currency}
					</Text>

					{(onEdit || onDelete) && (
						<HStack gap='1'>
							{onEdit && (
								<IconButton
									aria-label={t('fuelings.actions.editFueling')}
									size='sm'
									variant='ghost'
									onClick={onEdit}
									cursor='pointer'
								>
									<span>✏️</span>
								</IconButton>
							)}
							{onDelete && (
								<IconButton
									aria-label={t('fuelings.actions.deleteFueling')}
									size='sm'
									variant='ghost'
									colorPalette='red'
									onClick={onDelete}
									cursor='pointer'
								>
									<span>🗑️</span>
								</IconButton>
							)}
						</HStack>
					)}
				</Stack>
			</Stack>
		</Box>
	);
};

export default FuelingListItem;
