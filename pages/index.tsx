import {
	Box,
	Button,
	CardBody,
	CardRoot,
	Heading,
	SimpleGrid,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import RecentActivityList from '../components/dashboard/RecentActivityList';
import VehicleSummaryCard from '../components/dashboard/VehicleSummaryCard';
import FetchDataErrorAlert from '../components/errors/FetchDataErrorAlert';
import { toaster } from '../components/ui/toaster';
import { useDashboardData } from '../hooks/useDashboardData';
import { useLocale } from '../contexts/LocaleContext';

const HomePage = () => {
	const router = useRouter();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth/signin');
		},
	});
	const { t } = useLocale();
	const { data, isPending, isError, isFetching } = useDashboardData();
	const refreshErrorShown = useRef(false);

	useEffect(() => {
		if (isError && data && !refreshErrorShown.current) {
			toaster.create({
				title: t('dashboard.refreshFailed'),
				type: 'error',
			});
			refreshErrorShown.current = true;
		}

		if (!isError) {
			refreshErrorShown.current = false;
		}
	}, [data, isError, t]);

	if (status === 'loading' || isPending) {
		return <DashboardSkeleton />;
	}

	if (isError && !data) {
		return <FetchDataErrorAlert errorMessage={t('errors.generic')} />;
	}

	if (!data) {
		return <DashboardSkeleton />;
	}

	const { vehicles, recentActivity } = data;
	const hasVehicles = vehicles.length > 0;
	const hasActivity = recentActivity.length > 0;

	return (
		<Box
			maxW='1200px'
			mx='auto'
			px={{ base: '4', md: '6' }}
			py={{ base: '6', md: '8' }}
		>
			<Stack gap={{ base: '6', md: '8' }}>
				<Stack gap='2'>
					<Stack direction='row' align='center' gap='3'>
						<Heading size='xl'>{t('dashboard.title')}</Heading>
						{isFetching && data && <Spinner size='sm' color='gray.500' />}
					</Stack>
					<Text color='gray.600'>{t('dashboard.subtitle')}</Text>
				</Stack>

				<Stack gap={{ base: '6', md: '8' }}>
					<CardRoot variant='outline' order={2}>
						<CardBody>
							<Stack gap='4'>
								<Heading size='md'>{t('dashboard.activityTitle')}</Heading>
								{hasActivity ? (
									<RecentActivityList items={recentActivity} />
								) : (
									<Box textAlign='center' py='10'>
										<Text fontSize='4xl' mb='4'>
											🧾
										</Text>
										<Heading size='md' mb='2'>
											{t('dashboard.emptyActivityTitle')}
										</Heading>
										<Text color='gray.500'>
											{t('dashboard.emptyActivityDescription')}
										</Text>
									</Box>
								)}
							</Stack>
						</CardBody>
					</CardRoot>

					<CardRoot variant='outline' order={1}>
						<CardBody>
							<Stack gap='4'>
								<Stack
									direction={{ base: 'column', sm: 'row' }}
									justify='space-between'
									align={{ base: 'flex-start', sm: 'center' }}
									gap='3'
								>
									<Heading size='md'>{t('dashboard.vehiclesTitle')}</Heading>
									<NextLink href='/vehicles/new' passHref legacyBehavior>
										<Button as='a' colorPalette='blue' size='sm'>
											{t('dashboard.emptyVehiclesCta')}
										</Button>
									</NextLink>
								</Stack>
								{hasVehicles ? (
									<SimpleGrid columns={{ base: 1, lg: 2 }} gap='4'>
										{vehicles.map((vehicle) => (
											<VehicleSummaryCard
												key={vehicle.id}
												vehicle={vehicle}
												labels={{
													totalSpent: t('dashboard.totalSpent'),
													averageConsumption: t('dashboard.averageConsumption'),
													totalDistance: t('dashboard.totalDistance'),
													lastFueling: t('dashboard.lastFueling'),
													viewVehicle: t('dashboard.viewVehicle'),
													quickAdd: t('dashboard.quickAdd'),
												}}
											/>
										))}
									</SimpleGrid>
								) : (
									<Box textAlign='center' py='10'>
										<Text fontSize='4xl' mb='4'>
											🚗
										</Text>
										<Heading size='md' mb='2'>
											{t('dashboard.emptyVehiclesTitle')}
										</Heading>
										<Text color='gray.500' mb='6'>
											{t('dashboard.emptyVehiclesDescription')}
										</Text>
									</Box>
								)}
							</Stack>
						</CardBody>
					</CardRoot>
				</Stack>
			</Stack>
		</Box>
	);
};

export default HomePage;
