import { format, parseISO } from 'date-fns';
import { Badge, Box, HStack, IconButton, Stack, Text } from '@chakra-ui/react';
import { FuelingData } from '../../types';

interface FuelingListItemProps {
	fueling: FuelingData;
	currency: string;
	onEdit?: () => void;
	onDelete?: () => void;
}

const FuelingListItem: React.FC<FuelingListItemProps> = ({
	fueling,
	currency,
	onEdit,
	onDelete,
}) => {
	const formattedDate = format(parseISO(fueling.date), 'MMM d, yyyy');
	const isPartialTank = !fueling.full_tank;

	return (
		<Box
			p='3'
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
				gap='3'
			>
				<Box flex='1'>
					<HStack gap='2' wrap='wrap' mb='1'>
						<Text fontWeight='semibold' fontSize='sm'>
							{formattedDate}
						</Text>
						{isPartialTank ? (
							<Badge colorPalette='orange' size='sm' variant='solid'>
								Partial Tank
							</Badge>
						) : (
							<Badge colorPalette='green' size='sm' variant='subtle'>
								Full Tank
							</Badge>
						)}
						<Badge
							colorPalette='gray'
							size='sm'
							variant='outline'
							textTransform='capitalize'
						>
							{fueling.fuel_type}
						</Badge>
					</HStack>
					<Text fontSize='sm' color='gray.500'>
						{fueling.quantity.toFixed(2)} L @ {fueling.cost_per_unit.toFixed(3)}{' '}
						{currency}/L • Odo: {fueling.mileage.toLocaleString()}
					</Text>
				</Box>

				<Stack
					direction='row'
					align='center'
					justify='space-between'
					w={{ base: 'full', md: 'auto' }}
					gap='2'
				>
					<Text fontSize='md' fontWeight='bold' color='blue.600'>
						{fueling.cost.toFixed(2)} {currency}
					</Text>

					{(onEdit || onDelete) && (
						<HStack gap='1'>
							{onEdit && (
								<IconButton
									aria-label='Edit fueling'
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
									aria-label='Delete fueling'
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
