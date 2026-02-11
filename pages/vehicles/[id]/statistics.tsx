import { Box, Button, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Vehicle } from '@prisma/client';
import { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import FetchDataErrorAlert from '../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../components/Loading';
import {
	ChartsSection,
	StatisticsSummary,
} from '../../../components/statistics';
import { useLocale } from '../../../contexts/LocaleContext';
import { useVehicleStatistics } from '../../../hooks/useVehicleStatistics';

const VehicleStatisticsPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { status } = useSession({ required: true });
	const { t } = useLocale();

	const vehicleId = id ? Number(id) : undefined;
	const [selectedYear, setSelectedYear] = useState<number | null>(null);

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
	} = useVehicleStatistics(vehicleId, selectedYear ?? undefined);

	const availableYears = statistics?.availableYears ?? [];
	const resolvedSelectedYear = selectedYear ?? statistics?.selectedYear ?? null;

	const handleAddFueling = () => {
		if (vehicleId) {
			router.push(`/vehicles/${vehicleId}/fuelings/new`);
		}
	};

	const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const nextYear = Number(event.target.value);
		setSelectedYear(Number.isNaN(nextYear) ? null : nextYear);
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
				<Link href='/'>
					<Button variant='outline'>
						<FaHome />
						{t('statistics.goToDashboard')}
					</Button>
				</Link>

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
							<Stack
								direction={{ base: 'column', md: 'row' }}
								align='flex-start'
								justify='space-between'
								gap='4'
								mb='4'
							>
								<Box>
									<Heading size='md' mb='2'>
										Charts
									</Heading>
									<Text color='gray.600'>
										Trends across time for consumption and monthly costs.
									</Text>
								</Box>
								{availableYears.length > 1 && (
									<Box minW='140px'>
										<chakra.label
											htmlFor='statistics-year'
											fontSize='sm'
											fontWeight='medium'
											mb='2'
											display='block'
										>
											Consumption year
										</chakra.label>
										<chakra.select
											id='statistics-year'
											onChange={handleYearChange}
											value={resolvedSelectedYear ?? ''}
											className='chakra-select'
											p='2'
											borderWidth='1px'
											borderRadius='md'
											w='full'
										>
											{availableYears.map((year) => (
												<option key={year} value={year}>
													{year}
												</option>
											))}
										</chakra.select>
									</Box>
								)}
							</Stack>
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
