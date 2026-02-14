import { Box, Button, ButtonGroup, Heading, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Vehicle } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FuelingForm } from '../../../../../components/fueling';
import { FuelingData } from '../../../../../types';
import FetchDataErrorAlert from '../../../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../../../components/Loading';

const fuelTypeById: Record<number, string> = {
	1: 'gasoline',
	2: 'diesel',
	3: 'lpg',
	4: 'electric',
	5: 'hybrid',
};

type FuelingApiItem = FuelingData & {
	fuel_type_id?: number;
	fuel_type?: string | null;
};

const EditFuelingPage: React.FC = () => {
	const router = useRouter();
	const { id, fuelingId } = router.query;
	const { status } = useSession({ required: true });

	const vehicleId = id ? Number(id) : undefined;
	const fuelingIdNum = fuelingId ? Number(fuelingId) : undefined;

	// Fetch vehicle data
	const {
		data: vehicle,
		isPending: isVehiclePending,
		isError: isVehicleError,
	} = useQuery({
		queryKey: ['vehicle', vehicleId],
		queryFn: async () => {
			const response = await fetch(`/api/vehicles/${vehicleId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch vehicle');
			}
			return response.json() as Promise<Vehicle>;
		},
		enabled: !!vehicleId,
	});

	// Fetch fueling data
	const {
		data: fueling,
		isPending: isFuelingPending,
		isError: isFuelingError,
	} = useQuery({
		queryKey: ['fueling', fuelingIdNum],
		queryFn: async () => {
			const response = await fetch(`/api/fueling/${fuelingIdNum}`);
			if (!response.ok) {
				throw new Error('Failed to fetch fueling');
			}

			const rawData = (await response.json()) as FuelingApiItem;

			const normalizedFuelType =
				typeof rawData.fuel_type === 'string' && rawData.fuel_type.trim() !== ''
					? rawData.fuel_type
					: fuelTypeById[rawData.fuel_type_id || 0] || 'gasoline';

			return {
				...rawData,
				fuel_type: normalizedFuelType,
			} as FuelingData;
		},
		enabled: !!fuelingIdNum,
	});

	const handleSubmitSuccess = () => {
		router.push(`/vehicles/${id}/fuelings`);
	};

	const handleCancel = () => {
		router.push(`/vehicles/${id}/fuelings`);
	};

	// Loading states
	if (status === 'loading' || isVehiclePending || isFuelingPending) {
		return <Loading />;
	}

	// Error states
	if (isVehicleError || isFuelingError || !vehicle || !fueling) {
		return (
			<FetchDataErrorAlert errorMessage='Failed to load fueling details.' />
		);
	}

	// Security check - ensure fueling belongs to this vehicle
	if (fueling.vehicle_id !== vehicle.id) {
		return (
			<FetchDataErrorAlert errorMessage='Fueling record does not belong to this vehicle.' />
		);
	}

	const formattedDate = new Date(fueling.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<Box maxW='1200px' mx='auto' p='4'>
			{/* Header */}
			<Box mb='6'>
				<Heading size='xl' mb='2'>
					Edit Fueling
				</Heading>
				<Text color='gray.600'>
					{vehicle.brand_name} {vehicle.model_name} • {formattedDate}
				</Text>
			</Box>

			{/* Back Button */}
			<ButtonGroup mb='6'>
				<Button variant='ghost' onClick={handleCancel}>
					← Back to Fuelings
				</Button>
			</ButtonGroup>

			{/* Fueling Form */}
			<FuelingForm
				vehicle={vehicle}
				initialData={fueling}
				mode='edit'
				onSubmitSuccess={handleSubmitSuccess}
			/>
		</Box>
	);
};

export default EditFuelingPage;
