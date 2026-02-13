import {
	Box,
	Button,
	CardBody,
	CardRoot,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import type { Vehicle } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FetchDataErrorAlert from '../../components/errors/FetchDataErrorAlert';
import Loading from '../../components/Loading';
import VehicleCard from '../../components/VehicleCard';
import { useLocale } from '../../contexts/LocaleContext';

const EmptyState = () => {
	const { t } = useLocale();

	return (
		<CardRoot variant='outline'>
			<CardBody>
				<Box textAlign='center' py={{ base: '10', md: '14' }} px='4'>
					<Text fontSize='5xl' mb='4'>
						🚗
					</Text>
					<Heading size='md' mb='2'>
						{t('dashboard.emptyVehiclesTitle')}
					</Heading>
					<Text color='gray.500' maxW='lg' mx='auto' mb='6'>
						{t('dashboard.emptyVehiclesDescription')}
					</Text>
					<NextLink href='/vehicles/new' passHref legacyBehavior>
						<Button as='a' colorPalette='blue'>
							{t('dashboard.emptyVehiclesCta')}
						</Button>
					</NextLink>
				</Box>
			</CardBody>
		</CardRoot>
	);
};

const AllVehicles = () => {
	const router = useRouter();
	const { t } = useLocale();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth/signin');
		},
	});
	const { isPending, isError, data } = useQuery<Vehicle[]>({
		queryKey: ['vehicles'],
		queryFn: async () => {
			const result = await fetch('/api/vehicles');

			if (!result.ok) {
				throw new Error('Failed to fetch vehicles');
			}

			return result.json() as Promise<Vehicle[]>;
		},
		enabled: status === 'authenticated',
	});

	if (status !== 'authenticated') return <Loading />;

	if (isPending) return <Loading />;

	if (isError)
		return <FetchDataErrorAlert errorMessage={t('errors.generic')} />;

	// Empty state when no vehicles exist
	if (!data || data.length === 0) {
		return <EmptyState />;
	}

	return (
		<Box>
			<Stack gap={{ base: '6', md: '8' }}>
				<Stack
					direction={{ base: 'column', md: 'row' }}
					justify='space-between'
					align={{ base: 'flex-start', md: 'center' }}
					gap='3'
				>
					<Stack gap='2'>
						<Heading size='xl'>{t('nav.vehicles')}</Heading>
						<Text color='gray.600'>{t('vehicles.list.subtitle')}</Text>
					</Stack>
					<NextLink href='/vehicles/new' passHref legacyBehavior>
						<Button as='a' colorPalette='blue'>
							{t('dashboard.emptyVehiclesCta')}
						</Button>
					</NextLink>
				</Stack>

				<CardRoot variant='outline'>
					<CardBody>
						<Stack gap='5'>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								justify='space-between'
								align={{ base: 'flex-start', sm: 'center' }}
								gap='2'
							>
								<Heading size='md'>{t('vehicles.list.yourGarage')}</Heading>
								<Text color='gray.500' fontSize='sm'>
									{data.length} {t('vehicles.list.countLabel')}
								</Text>
							</Stack>

							<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='4'>
								{data.map((vehicle) => (
									<VehicleCard key={vehicle.id} vehicle={vehicle} />
								))}
							</SimpleGrid>
						</Stack>
					</CardBody>
				</CardRoot>
			</Stack>
		</Box>
	);
};

export default AllVehicles;
