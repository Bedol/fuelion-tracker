import { Box, Button, ButtonGroup, Heading, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Vehicle } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Layout from '../../../../components/Layout';
import { FuelingForm } from '../../../../components/fueling';
import FetchDataErrorAlert from '../../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../../components/Loading';

const NewFuelingPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
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

	const handleCancel = () => {
		router.push(`/vehicles/${id}/fuelings`);
	};

	// Loading states
	if (status === 'loading' || isPending) {
		return (
			<Layout>
				<Loading />
			</Layout>
		);
	}

	if (isError || !vehicle) {
		return (
			<Layout>
				<FetchDataErrorAlert errorMessage='Failed to load vehicle details.' />
			</Layout>
		);
	}

	return (
		<Layout>
			<Box maxW='1200px' mx='auto' p='4'>
				{/* Header */}
				<Box mb='6'>
					<Heading size='xl' mb='2'>
						Add Fueling
					</Heading>
					<Text color='gray.600'>
						{vehicle.brand_name} {vehicle.model_name} •{' '}
						{vehicle.production_year}
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
					mode='create'
					onSubmitSuccess={handleSubmitSuccess}
				/>
			</Box>
		</Layout>
	);
};

export default NewFuelingPage;
