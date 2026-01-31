import { format, parseISO } from 'date-fns';
import { Box, Flex, Text, Badge, IconButton, HStack } from '@chakra-ui/react';
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
			p='4'
			borderWidth='1px'
			borderRadius='md'
			borderColor={isPartialTank ? 'orange.300' : 'gray.200'}
			bg={isPartialTank ? 'orange.50' : 'white'}
			_hover={{ shadow: 'sm' }}
			transition='all 0.2s'
		>
			<Flex justify='space-between' align='flex-start' gap='4'>
				{/* Left: Date and indicators */}
				<Box flex='1'>
					<Flex align='center' gap='2' mb='2'>
						<Text fontWeight='semibold' fontSize='md'>
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
					</Flex>

					{/* Fuel type badge */}
					<Badge
						colorPalette='gray'
						size='sm'
						variant='outline'
						textTransform='capitalize'
						mb='2'
					>
						{fueling.fuel_type}
					</Badge>
				</Box>

				{/* Right: Cost and price info */}
				<Box textAlign='right'>
					<Text fontSize='lg' fontWeight='bold' color='blue.600'>
						{fueling.cost.toFixed(2)} {currency}
					</Text>
					<Text fontSize='sm' color='gray.500'>
						{fueling.quantity.toFixed(2)} L @ {fueling.cost_per_unit.toFixed(3)}{' '}
						{currency}/L
					</Text>
					<Text fontSize='xs' color='gray.400' mt='1'>
						Odo: {fueling.mileage.toLocaleString()}
					</Text>
				</Box>
			</Flex>

			{/* Actions */}
			{(onEdit || onDelete) && (
				<HStack justify='flex-end' mt='3' gap='2'>
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
		</Box>
	);
};

export default FuelingListItem;
