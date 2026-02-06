import {
	Button,
	CardBody,
	CardRoot,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';
import type { DashboardVehicleSummary } from '../../types/dashboard_types';

type VehicleSummaryCardProps = {
	vehicle: DashboardVehicleSummary;
};

const VehicleSummaryCard: React.FC<VehicleSummaryCardProps> = ({ vehicle }) => {
	const currencyFormatter = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: vehicle.currency,
	});
	const numberFormatter = new Intl.NumberFormat('pl-PL', {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	});
	const distanceFormatter = new Intl.NumberFormat('pl-PL');

	const formattedConsumption = `${numberFormatter.format(
		vehicle.averageConsumption
	)} L/100km`;
	const formattedDistance = `${distanceFormatter.format(
		vehicle.totalDistance
	)} km`;
	const formattedLastFuelingDate = vehicle.lastFuelingDate
		? format(parseISO(vehicle.lastFuelingDate), 'dd MMM yyyy')
		: '--';
	const registrationLabel = vehicle.registrationNumber ?? 'No registration';

	return (
		<CardRoot variant='outline'>
			<CardBody>
				<Stack gap='4'>
					<Stack gap='1'>
						<Heading size='md'>
							{vehicle.brandName} {vehicle.modelName}
						</Heading>
						<Text color='gray.500' fontSize='sm'>
							{registrationLabel}
						</Text>
					</Stack>

					<Text color='gray.600' fontSize='sm'>
						Fuel type: {vehicle.fuelType}
					</Text>

					<SimpleGrid columns={{ base: 1, md: 2 }} gap='4'>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								Total spent
							</Text>
							<Heading size='sm'>
								{currencyFormatter.format(vehicle.totalSpent)}
							</Heading>
						</Stack>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								Average consumption
							</Text>
							<Heading size='sm'>{formattedConsumption}</Heading>
						</Stack>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								Total distance
							</Text>
							<Heading size='sm'>{formattedDistance}</Heading>
						</Stack>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								Last fueling
							</Text>
							<Heading size='sm'>{formattedLastFuelingDate}</Heading>
						</Stack>
					</SimpleGrid>

					<Stack direction={{ base: 'column', sm: 'row' }} gap='3'>
						<NextLink href={`/vehicles/${vehicle.id}`} passHref legacyBehavior>
							<Button as='a' variant='outline' colorPalette='blue'>
								View
							</Button>
						</NextLink>
						<NextLink
							href={`/vehicles/${vehicle.id}/fuelings/new`}
							passHref
							legacyBehavior
						>
							<Button as='a' colorPalette='green'>
								Quick add
							</Button>
						</NextLink>
					</Stack>
				</Stack>
			</CardBody>
		</CardRoot>
	);
};

export default VehicleSummaryCard;
