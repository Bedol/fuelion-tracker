import React from 'react';
import {
	Badge,
	Box,
	CardBody,
	CardRoot,
	Heading,
	Stack,
	Text,
} from '@chakra-ui/react';
import type { Vehicle } from '@prisma/client';
import NextLink from 'next/link';
import { useLocale } from '../contexts/LocaleContext';
import { fuelTypes } from '../types/vehicle_types';

type VehicleCardProps = {
	vehicle: Vehicle;
};

type FuelTypeColorPalette = 'orange' | 'gray' | 'blue' | 'green' | 'teal';

type FuelTypeConfig = {
	icon: string;
	colorPalette: FuelTypeColorPalette;
};

const fuelTypeMap: Record<string, FuelTypeConfig> = {
	gasoline: {
		icon: '⛽',
		colorPalette: 'orange',
	},
	diesel: {
		icon: '🛢️',
		colorPalette: 'gray',
	},
	lpg: {
		icon: '💨',
		colorPalette: 'blue',
	},
	electric: {
		icon: '⚡',
		colorPalette: 'green',
	},
	hybrid: {
		icon: '🔋',
		colorPalette: 'teal',
	},
};

const getFuelTypeDisplay = (fuelType: string): FuelTypeConfig => {
	const normalizedType = fuelType.toLowerCase().trim();
	return (
		fuelTypeMap[normalizedType] || {
			icon: '⛽',
			colorPalette: 'gray',
		}
	);
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
	const { t } = useLocale();
	const normalizedFuelType = vehicle.fuel_type.toLowerCase().trim();
	const fuelTypeDisplay = getFuelTypeDisplay(vehicle.fuel_type);
	const translatedFuelType = t(`vehicles.fuelTypes.${normalizedFuelType}`);
	const mappedFuelType = fuelTypes.find(
		(item) => item.value === normalizedFuelType
	);
	const fuelTypeLabel = translatedFuelType.startsWith('vehicles.fuelTypes.')
		? mappedFuelType?.name || vehicle.fuel_type
		: translatedFuelType;
	const registrationLabel =
		vehicle.registration_number || t('vehicles.detail.values.notRegistered');

	return (
		<NextLink href={`/vehicles/${vehicle.id}`} passHref legacyBehavior>
			<Box
				as='a'
				display='block'
				borderRadius='lg'
				_focusVisible={{
					outline: '2px solid',
					outlineColor: 'blue.400',
					outlineOffset: '2px',
				}}
			>
				<CardRoot
					variant='outline'
					transition='all 0.2s ease'
					_hover={{
						borderColor: 'blue.300',
						shadow: 'md',
						transform: 'translateY(-1px)',
					}}
				>
					<CardBody>
						<Stack gap='4'>
							<Stack direction='row' justify='space-between' align='flex-start'>
								<Badge
									variant='subtle'
									colorPalette={fuelTypeDisplay.colorPalette}
								>
									{fuelTypeDisplay.icon} {fuelTypeLabel}
								</Badge>
								<Text color='gray.500' fontSize='sm'>
									{vehicle.production_year}
								</Text>
							</Stack>

							<Stack gap='1'>
								<Heading size='md'>
									{vehicle.brand_name} {vehicle.model_name}
								</Heading>
								<Text
									fontSize='sm'
									color={vehicle.registration_number ? 'gray.600' : 'gray.400'}
									fontStyle={vehicle.registration_number ? 'normal' : 'italic'}
								>
									{registrationLabel}
								</Text>
							</Stack>

							<Text fontSize='sm' color='blue.600' fontWeight='medium'>
								{t('dashboard.viewVehicle')}
							</Text>
						</Stack>
					</CardBody>
				</CardRoot>
			</Box>
		</NextLink>
	);
};

export default VehicleCard;
