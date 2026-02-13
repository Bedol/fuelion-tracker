import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { Vehicle } from '@prisma/client';
import { FuelingForm } from '../../../../components/fueling';
import FetchDataErrorAlert from '../../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../../components/Loading';
import { useLocale } from '../../../../contexts/LocaleContext';

const NewFuelingPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { locale, t } = useLocale();
	const { status } = useSession({ required: true });

	const vehicleId = id ? Number(id) : undefined;

	// Fetch vehicle data
	const {
		data: vehicle,
		isPending,
		isError,
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

	const handleSubmitSuccess = () => {
		router.push(`/vehicles/${id}/fuelings`);
	};

	if (status === 'loading' || isPending) {
		return <Loading />;
	}

	if (isError || !vehicle) {
		return (
			<FetchDataErrorAlert
				errorMessage={t('fuelings.errors.loadVehicleDetails')}
			/>
		);
	}

	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';

	return (
		<Box maxW='800px' mx='auto' p='4'>
			<Stack gap='6'>
				<Box>
					<Heading mb='2' size='lg'>
						{t('fuelings.form.titles.addFueling')}
					</Heading>
					<Text color='gray.600'>
						{vehicle.brand_name} {vehicle.model_name} •{' '}
						{vehicle.production_year} •{' '}
						{vehicle.mileage.toLocaleString(localeCode)} {vehicle.mileage_unit}
					</Text>
				</Box>

				<FuelingForm
					vehicle={vehicle}
					mode='create'
					onSubmitSuccess={handleSubmitSuccess}
				/>
			</Stack>
		</Box>
	);
};

export default NewFuelingPage;
