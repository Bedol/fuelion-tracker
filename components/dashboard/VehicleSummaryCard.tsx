import React from 'react';
import {
	Button,
	CardBody,
	CardRoot,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLocale } from '../../contexts/LocaleContext';
import type { DashboardVehicleSummary } from '../../types/dashboard_types';

type VehicleSummaryCardProps = {
	vehicle: DashboardVehicleSummary;
	labels: {
		totalSpent: string;
		averageConsumption: string;
		totalDistance: string;
		lastFueling: string;
		viewVehicle: string;
		quickAdd: string;
	};
};

const VehicleSummaryCard: React.FC<VehicleSummaryCardProps> = ({
	vehicle,
	labels,
}) => {
	const { locale, t } = useLocale();
	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';

	const currencyFormatter = new Intl.NumberFormat(localeCode, {
		style: 'currency',
		currency: vehicle.currency,
	});
	const numberFormatter = new Intl.NumberFormat(localeCode, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	});
	const distanceFormatter = new Intl.NumberFormat(localeCode);

	const translatedFuelType = t(`vehicles.fuelTypes.${vehicle.fuelType}`);
	const fuelTypeLabel = translatedFuelType.startsWith('vehicles.fuelTypes.')
		? vehicle.fuelType
		: translatedFuelType;

	const formattedConsumption = `${numberFormatter.format(
		vehicle.averageConsumption
	)} L/100km`;
	const formattedDistance = `${distanceFormatter.format(
		vehicle.totalDistance
	)} km`;
	const formattedLastFuelingDate = vehicle.lastFuelingDate
		? new Date(vehicle.lastFuelingDate).toLocaleDateString(localeCode, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		: '--';
	const registrationLabel =
		vehicle.registrationNumber ?? t('dashboard.noRegistration');

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
						{t('dashboard.fuelTypeLabel')}: {fuelTypeLabel}
					</Text>

					<SimpleGrid columns={{ base: 1, md: 2 }} gap='4'>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								{labels.totalSpent}
							</Text>
							<Heading size='sm'>
								{currencyFormatter.format(vehicle.totalSpent)}
							</Heading>
						</Stack>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								{labels.averageConsumption}
							</Text>
							<Heading size='sm'>{formattedConsumption}</Heading>
						</Stack>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								{labels.totalDistance}
							</Text>
							<Heading size='sm'>{formattedDistance}</Heading>
						</Stack>
						<Stack gap='1'>
							<Text fontSize='sm' color='gray.500'>
								{labels.lastFueling}
							</Text>
							<Heading size='sm'>{formattedLastFuelingDate}</Heading>
						</Stack>
					</SimpleGrid>

					<Stack direction={{ base: 'column', sm: 'row' }} gap='3'>
						<NextLink href={`/vehicles/${vehicle.id}`} passHref legacyBehavior>
							<Button as='a' variant='outline' colorPalette='blue'>
								{labels.viewVehicle}
							</Button>
						</NextLink>
						<NextLink
							href={`/vehicles/${vehicle.id}/fuelings/new`}
							passHref
							legacyBehavior
						>
							<Button as='a' colorPalette='green'>
								{labels.quickAdd}
							</Button>
						</NextLink>
					</Stack>
				</Stack>
			</CardBody>
		</CardRoot>
	);
};

export default VehicleSummaryCard;
