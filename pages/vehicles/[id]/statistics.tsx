import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Vehicle } from '@prisma/client';
import FetchDataErrorAlert from '../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../components/Loading';
import {
	ChartsSection,
	StatisticsSummary,
} from '../../../components/statistics';
import { useVehicleStatistics } from '../../../hooks/useVehicleStatistics';

const VehicleStatisticsPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { status } = useSession({ required: true });

	const vehicleId = id ? Number(id) : undefined;

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

	const {
		data: statistics,
		isPending: isStatisticsPending,
		isError: isStatisticsError,
	} = useVehicleStatistics(vehicleId);

	const handleAddFueling = () => {
		if (vehicleId) {
			router.push(`/vehicles/${vehicleId}/fuelings/new`);
		}
	};

	if (status === 'loading' || isVehiclePending) {
		return <Loading />;
	}

	if (isVehicleError || !vehicle) {
		return (
			<FetchDataErrorAlert errorMessage='Failed to load vehicle details.' />
		);
	}

	return (
		<Box maxW='1200px' mx='auto' p='4'>
			<Box mb='6'>
				<Heading size='xl' mb='2'>
					{vehicle.brand_name} {vehicle.model_name}
				</Heading>
				<Text color='gray.600'>
					{vehicle.production_year} • {vehicle.mileage.toLocaleString()}{' '}
					{vehicle.mileage_unit}
				</Text>
			</Box>

			<Stack gap='2' mb='3'>
				<Heading size='sm'>Actions</Heading>
				<Text color='gray.500'>
					Add fuelings or return to the vehicle details view.
				</Text>
			</Stack>

			<Stack direction='row' mb='6' gap='4'>
				<Button colorPalette='blue' onClick={handleAddFueling} cursor='pointer'>
					Add Fueling
				</Button>
				<Button
					variant='ghost'
					onClick={() => router.push(`/vehicles/${id}`)}
					cursor='pointer'
				>
					{'<- Back to Vehicle'}
				</Button>
			</Stack>

			<Stack gap='6'>
				{isStatisticsError && (
					<FetchDataErrorAlert errorMessage='Failed to load statistics.' />
				)}
				{isStatisticsPending && <Loading />}
				{statistics && (
					<Stack gap='6'>
						<Box>
							<Heading size='lg' mb='2'>
								Statistics Overview
							</Heading>
							<Text color='gray.600'>
								Summary numbers and trends based on recorded fuelings.
							</Text>
						</Box>
						<Box>
							<Heading size='md' mb='3'>
								Summary
							</Heading>
							<Text color='gray.600' mb='4'>
								Totals and averages based on recorded fuelings.
							</Text>
							<StatisticsSummary
								summary={statistics.summary}
								currency={vehicle.currency}
							/>
						</Box>
						<Box>
							<Heading size='md' mb='3'>
								Charts
							</Heading>
							<Text color='gray.600' mb='4'>
								Trends across time for consumption and monthly costs.
							</Text>
							<ChartsSection
								consumption={statistics.consumption}
								monthlyCosts={statistics.monthlyCosts}
								currency={vehicle.currency}
								hasConsumptionData={statistics.hasConsumptionData}
								hasCostData={statistics.hasCostData}
							/>
						</Box>
					</Stack>
				)}
			</Stack>
		</Box>
	);
};

export default VehicleStatisticsPage;
