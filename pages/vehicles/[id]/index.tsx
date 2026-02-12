import {
	Badge,
	Box,
	Button,
	CardRoot,
	CardBody,
	Heading,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Vehicle } from '@prisma/client';
import FetchDataErrorAlert from '../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../components/Loading';
import DeleteVehicleModal from '../../../components/vehicles/DeleteVehicleModal';
import { useLocale } from '../../../contexts/LocaleContext';
import { FuelingData } from '../../../types';
import { fuelTypes } from '../../../types/vehicle_types';

type VehicleDetailPageProps = {
	vehicleId: string;
};

const getFuelTypeIcon = (fuelType: string): string => {
	const icons: Record<string, string> = {
		gasoline: '⛽',
		diesel: '🛢️',
		lpg: '💨',
		electric: '🔌',
		hybrid: '🔋',
	};
	return icons[fuelType] || '⛽';
};

const getFuelTypeLabel = (
	fuelType: string,
	t: (key: string) => string
): string => {
	const labels: Record<string, string> = {
		gasoline: t('vehicles.fuelTypes.gasoline'),
		diesel: t('vehicles.fuelTypes.diesel'),
		lpg: t('vehicles.fuelTypes.lpg'),
		electric: t('vehicles.fuelTypes.electric'),
		hybrid: t('vehicles.fuelTypes.hybrid'),
	};

	const type = fuelTypes.find((item) => item.value === fuelType);
	return labels[fuelType] || type?.name || fuelType;
};

const formatDate = (date: Date | string, locale: string): string => {
	return new Date(date).toLocaleDateString(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({ vehicleId }) => {
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const { locale, t } = useLocale();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth/signin');
		},
	});

	const {
		data: vehicle,
		isPending,
		isError,
	} = useQuery({
		queryKey: ['vehicle', vehicleId],
		queryFn: async () => {
			const result = await fetch(`/api/vehicles/${vehicleId}`);
			if (!result.ok) {
				throw new Error('Failed to fetch vehicle');
			}
			return result.json() as Promise<Vehicle>;
		},
		enabled: status === 'authenticated',
	});

	const {
		data: recentFuelings,
		isPending: isRecentFuelingsPending,
		isError: isRecentFuelingsError,
	} = useQuery({
		queryKey: ['fuelings', vehicleId, 'recent'],
		queryFn: async () => {
			const result = await fetch(`/api/fueling?vehicleId=${vehicleId}&take=10`);
			if (!result.ok) {
				throw new Error('Failed to fetch recent fuelings');
			}
			return result.json() as Promise<FuelingData[]>;
		},
		enabled: status === 'authenticated',
	});

	const handleDeleteSuccess = () => {
		router.push('/vehicles');
	};

	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';

	if (status !== 'authenticated') return <Loading />;

	if (isPending) return <Loading />;

	if (isError || !vehicle) {
		return (
			<FetchDataErrorAlert
				errorMessage={t('vehicles.detail.errors.loadVehicleDetails')}
			/>
		);
	}

	const hasTechnicalData =
		vehicle.engine_capacity || vehicle.engine_power || vehicle.transmission;

	return (
		<Box maxW='1200px' mx='auto' p='4'>
			{/* Section 1: Vehicle Header */}
			<Box mb='8'>
				<Heading size='xl' mb='2'>
					{vehicle.brand_name} {vehicle.model_name}
				</Heading>
				<Stack direction='row' gap='4' align='center' color='gray.600'>
					<Text>{vehicle.production_year}</Text>
					<Text>•</Text>
					<Badge variant='subtle' colorPalette='blue'>
						{getFuelTypeIcon(vehicle.fuel_type)}{' '}
						{getFuelTypeLabel(vehicle.fuel_type, t)}
					</Badge>
					{vehicle.registration_number && (
						<>
							<Text>•</Text>
							<Text>{vehicle.registration_number}</Text>
						</>
					)}
					{vehicle.engine_capacity && vehicle.engine_power && (
						<>
							<Text>•</Text>
							<Text>
								{(vehicle.engine_capacity / 1000).toFixed(1)}L,{' '}
								{vehicle.engine_power} {vehicle.power_unit || 'HP'}
							</Text>
						</>
					)}
				</Stack>
			</Box>

			{/* Section 2: Action Buttons */}
			<Stack direction={{ base: 'column', md: 'row' }} mb='8' gap='4' w='full'>
				<Button
					colorPalette='blue'
					variant='solid'
					w={{ base: 'full', md: 'auto' }}
					onClick={() => router.push(`/vehicles/${vehicleId}/statistics`)}
				>
					{t('vehicles.detail.actions.viewStatistics')}
				</Button>
				<Button
					colorPalette='blue'
					variant='outline'
					w={{ base: 'full', md: 'auto' }}
					onClick={() => router.push(`/vehicles/${vehicleId}/edit`)}
				>
					{t('vehicles.detail.actions.editVehicle')}
				</Button>
				<Button
					colorPalette='red'
					variant='outline'
					w={{ base: 'full', md: 'auto' }}
					onClick={() => setIsDeleteModalOpen(true)}
				>
					{t('vehicles.detail.actions.deleteVehicle')}
				</Button>
			</Stack>

			<Stack direction={{ base: 'column', md: 'row' }} gap='6' mb='8'>
				{/* Section 3: Basic Information Card */}
				<CardRoot flex='1'>
					<CardBody>
						<Heading size='md' mb='4'>
							{t('vehicles.detail.sections.basicInformation')}
						</Heading>
						<Stack gap='3'>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.brand')}
								</Text>
								<Text fontWeight='medium'>{vehicle.brand_name}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.model')}
								</Text>
								<Text fontWeight='medium'>{vehicle.model_name}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.productionYear')}
								</Text>
								<Text fontWeight='medium'>{vehicle.production_year}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.fuelType')}
								</Text>
								<Text fontWeight='medium'>
									{getFuelTypeIcon(vehicle.fuel_type)}{' '}
									{getFuelTypeLabel(vehicle.fuel_type, t)}
								</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.registration')}
								</Text>
								<Text fontWeight='medium'>
									{vehicle.registration_number ||
										t('vehicles.detail.values.notRegistered')}
								</Text>
							</Box>
						</Stack>
					</CardBody>
				</CardRoot>

				{/* Section 3: Technical Specifications Card */}
				{hasTechnicalData && (
					<CardRoot flex='1'>
						<CardBody>
							<Heading size='md' mb='4'>
								{t('vehicles.detail.sections.technicalSpecifications')}
							</Heading>
							<Stack gap='3'>
								{vehicle.engine_capacity && (
									<Box>
										<Text color='gray.500' fontSize='sm'>
											{t('vehicles.detail.fields.engineCapacity')}
										</Text>
										<Text fontWeight='medium'>
											{(vehicle.engine_capacity / 1000).toFixed(1)} L
										</Text>
									</Box>
								)}
								{vehicle.engine_power && (
									<Box>
										<Text color='gray.500' fontSize='sm'>
											{t('vehicles.detail.fields.enginePower')}
										</Text>
										<Text fontWeight='medium'>
											{vehicle.engine_power} {vehicle.power_unit || 'HP'}
										</Text>
									</Box>
								)}
								{vehicle.transmission && (
									<Box>
										<Text color='gray.500' fontSize='sm'>
											{t('vehicles.detail.fields.transmission')}
										</Text>
										<Text fontWeight='medium'>
											{vehicle.transmission === 'manual'
												? t('vehicles.detail.values.manual')
												: t('vehicles.detail.values.automatic')}
										</Text>
									</Box>
								)}
							</Stack>
						</CardBody>
					</CardRoot>
				)}

				{/* Section 3: Metadata Card */}
				<CardRoot flex='1'>
					<CardBody>
						<Heading size='md' mb='4'>
							{t('vehicles.detail.sections.vehicleStatus')}
						</Heading>
						<Stack gap='3'>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.currentMileage')}
								</Text>
								<Text fontWeight='medium'>
									{vehicle.mileage.toLocaleString(localeCode)}{' '}
									{vehicle.mileage_unit}
								</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.currency')}
								</Text>
								<Text fontWeight='medium'>{vehicle.currency}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.addedOn')}
								</Text>
								<Text fontWeight='medium'>
									{formatDate(vehicle.created_at, localeCode)}
								</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									{t('vehicles.detail.fields.lastUpdated')}
								</Text>
								<Text fontWeight='medium'>
									{formatDate(vehicle.updated_at, localeCode)}
								</Text>
							</Box>
						</Stack>
					</CardBody>
				</CardRoot>
			</Stack>

			{/* Section 4: Recent Fueling Records */}
			<CardRoot variant='outline'>
				<CardBody>
					<Heading size='md' mb='4'>
						{t('vehicles.last10Fuelings')}
					</Heading>

					<Stack direction={{ base: 'column', sm: 'row' }} gap='3' mb='6'>
						<Button
							colorPalette='blue'
							w={{ base: 'full', sm: 'auto' }}
							onClick={() => router.push(`/vehicles/${vehicleId}/fuelings/new`)}
							cursor='pointer'
						>
							{t('vehicles.detail.actions.addFueling')}
						</Button>
						<Button
							variant='outline'
							w={{ base: 'full', sm: 'auto' }}
							onClick={() => router.push(`/vehicles/${vehicleId}/fuelings`)}
							cursor='pointer'
						>
							{t('vehicles.detail.actions.viewAllFuelings')}
						</Button>
					</Stack>

					{isRecentFuelingsPending && (
						<Text color='gray.500' mb='4'>
							{t('vehicles.detail.messages.loadingRecentFuelings')}
						</Text>
					)}

					{isRecentFuelingsError && (
						<Text color='red.500' mb='4'>
							{t('vehicles.detail.errors.loadRecentFuelings')}
						</Text>
					)}

					{!isRecentFuelingsPending &&
						!isRecentFuelingsError &&
						recentFuelings &&
						recentFuelings.length > 0 && (
							<Stack gap='3' mb='6'>
								{recentFuelings.map((fueling) => (
									<Box
										key={fueling.id}
										p='4'
										borderWidth='1px'
										borderRadius='md'
									>
										<Stack
											direction={{ base: 'column', sm: 'row' }}
											justify='space-between'
											gap='3'
										>
											<Box>
												<Text fontWeight='medium'>
													{formatDate(fueling.date, localeCode)}
												</Text>
												<Text fontSize='sm' color='gray.500'>
													{fueling.quantity.toFixed(2)} L •{' '}
													{fueling.mileage.toLocaleString(localeCode)}{' '}
													{vehicle.mileage_unit}
												</Text>
											</Box>
											<Box textAlign={{ base: 'left', sm: 'right' }}>
												<Text fontWeight='semibold'>
													{fueling.cost.toFixed(2)} {vehicle.currency}
												</Text>
												<Text fontSize='sm' color='gray.500'>
													{fueling.cost_per_unit.toFixed(3)} {vehicle.currency}
													/L
												</Text>
											</Box>
										</Stack>
									</Box>
								))}
							</Stack>
						)}

					{!isRecentFuelingsPending &&
						!isRecentFuelingsError &&
						recentFuelings &&
						recentFuelings.length === 0 && (
							<Text color='gray.500' mb='6'>
								{t('vehicles.detail.messages.emptyRecentFuelings')}
							</Text>
						)}
				</CardBody>
			</CardRoot>

			{/* Delete Confirmation Modal */}
			<DeleteVehicleModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				vehicle={{
					id: vehicle.id,
					brand_name: vehicle.brand_name,
					model_name: vehicle.model_name,
					production_year: vehicle.production_year,
				}}
				onDeleteSuccess={handleDeleteSuccess}
			/>
		</Box>
	);
};

export const getServerSideProps = async (context: {
	params: { id: string };
}) => {
	const { id } = context.params;

	return {
		props: {
			vehicleId: id,
		},
	};
};

export default VehicleDetailPage;
