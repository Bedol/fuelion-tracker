import {
	Badge,
	Box,
	Button,
	ButtonGroup,
	CardRoot,
	CardBody,
	Heading,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Vehicle } from '@prisma/client';
import FetchDataErrorAlert from '../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../components/Loading';
import DeleteVehicleModal from '../../../components/vehicles/DeleteVehicleModal';
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

const getFuelTypeLabel = (fuelType: string): string => {
	const type = fuelTypes.find((t) => t.value === fuelType);
	return type?.name || fuelType;
};

const formatDate = (date: Date | string): string => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({ vehicleId }) => {
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
	});

	const handleDeleteSuccess = () => {
		router.push('/vehicles');
	};

	if (isPending) return <Loading />;

	if (isError || !vehicle) {
		return (
			<FetchDataErrorAlert errorMessage='Failed to load vehicle details.' />
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
						{getFuelTypeLabel(vehicle.fuel_type)}
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
			<ButtonGroup mb='8' gap='4'>
				<Button
					colorPalette='blue'
					variant='solid'
					onClick={() => router.push(`/vehicles/${vehicleId}/statistics`)}
				>
					View statistics
				</Button>
				<Button
					colorPalette='blue'
					variant='outline'
					onClick={() => router.push(`/vehicles/${vehicleId}/edit`)}
				>
					Edit Vehicle
				</Button>
				<Button
					colorPalette='red'
					variant='outline'
					onClick={() => setIsDeleteModalOpen(true)}
				>
					Delete Vehicle
				</Button>
				<Button variant='ghost' onClick={() => router.push('/vehicles')}>
					← Back to Vehicles
				</Button>
			</ButtonGroup>

			<Stack direction={{ base: 'column', md: 'row' }} gap='6' mb='8'>
				{/* Section 3: Basic Information Card */}
				<CardRoot flex='1'>
					<CardBody>
						<Heading size='md' mb='4'>
							Basic Information
						</Heading>
						<Stack gap='3'>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Brand
								</Text>
								<Text fontWeight='medium'>{vehicle.brand_name}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Model
								</Text>
								<Text fontWeight='medium'>{vehicle.model_name}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Production Year
								</Text>
								<Text fontWeight='medium'>{vehicle.production_year}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Fuel Type
								</Text>
								<Text fontWeight='medium'>
									{getFuelTypeIcon(vehicle.fuel_type)}{' '}
									{getFuelTypeLabel(vehicle.fuel_type)}
								</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Registration
								</Text>
								<Text fontWeight='medium'>
									{vehicle.registration_number || 'Not registered'}
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
								Technical Specifications
							</Heading>
							<Stack gap='3'>
								{vehicle.engine_capacity && (
									<Box>
										<Text color='gray.500' fontSize='sm'>
											Engine Capacity
										</Text>
										<Text fontWeight='medium'>
											{(vehicle.engine_capacity / 1000).toFixed(1)} L
										</Text>
									</Box>
								)}
								{vehicle.engine_power && (
									<Box>
										<Text color='gray.500' fontSize='sm'>
											Engine Power
										</Text>
										<Text fontWeight='medium'>
											{vehicle.engine_power} {vehicle.power_unit || 'HP'}
										</Text>
									</Box>
								)}
								{vehicle.transmission && (
									<Box>
										<Text color='gray.500' fontSize='sm'>
											Transmission
										</Text>
										<Text fontWeight='medium'>
											{vehicle.transmission === 'manual'
												? 'Manual'
												: 'Automatic'}
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
							Vehicle Status
						</Heading>
						<Stack gap='3'>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Current Mileage
								</Text>
								<Text fontWeight='medium'>
									{vehicle.mileage.toLocaleString()} {vehicle.mileage_unit}
								</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Currency
								</Text>
								<Text fontWeight='medium'>{vehicle.currency}</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Added On
								</Text>
								<Text fontWeight='medium'>
									{formatDate(vehicle.created_at)}
								</Text>
							</Box>
							<Box>
								<Text color='gray.500' fontSize='sm'>
									Last Updated
								</Text>
								<Text fontWeight='medium'>
									{formatDate(vehicle.updated_at)}
								</Text>
							</Box>
						</Stack>
					</CardBody>
				</CardRoot>
			</Stack>

			{/* Section 4: Placeholder for Future Features */}
			<CardRoot variant='outline'>
				<CardBody>
					<Box textAlign='center' py='8'>
						<Text fontSize='2xl' mb='4'>
							⛽
						</Text>
						<Heading size='md' mb='2' color='gray.600'>
							Fueling Records & Statistics
						</Heading>
						<Text color='gray.500' mb='4'>
							Track your fuel expenses and view statistics
						</Text>
						<ButtonGroup gap='3'>
							<Button
								colorPalette='blue'
								onClick={() =>
									router.push(`/vehicles/${vehicleId}/fuelings/new`)
								}
								cursor='pointer'
							>
								Add Fueling
							</Button>
							<Button
								variant='outline'
								onClick={() => router.push(`/vehicles/${vehicleId}/fuelings`)}
								cursor='pointer'
							>
								View All Fuelings
							</Button>
						</ButtonGroup>
					</Box>
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
