import { Box, Heading } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import VehicleForm from '../../components/vehicles/VehicleForm';
import { toaster } from '../../components/ui/toaster';
import FetchDataErrorAlert from '../../components/errors/FetchDataErrorAlert';
import Loading from '../../components/Loading';

const NewVehiclePage = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const queryClient = useQueryClient();

	const vehicleMutation = useMutation({
		mutationFn: async (values: {
			brand_name: string;
			model_name: string;
			production_year: number;
			fuel_type: string;
			registration_number?: string;
			engine_capacity?: number;
			engine_power?: number;
			power_unit?: string;
			transmission?: string;
		}) => {
			if (!session?.user?.id) {
				throw new Error('User not authenticated');
			}

			const resp = await fetch('/api/vehicles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...values,
					user_id: Number(session.user.id),
				}),
			});

			if (!resp.ok) {
				const error = await resp.json();
				throw new Error(error.message || 'Failed to create vehicle');
			}

			return resp.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
			toaster.create({
				title: 'Vehicle created successfully',
				type: 'success',
			});
			router.push('/vehicles');
		},
		onError: (error) => {
			toaster.create({
				title:
					error instanceof Error ? error.message : 'Failed to create vehicle',
				type: 'error',
			});
		},
	});

	if (status === 'loading') {
		return <Loading />;
	}

	if (status === 'unauthenticated') {
		return (
			<FetchDataErrorAlert errorMessage='You need to sign in to create a vehicle.' />
		);
	}

	const initialValues = {
		brand_name: '',
		model_name: '',
		production_year: new Date().getFullYear(),
		fuel_type: 'gasoline',
		registration_number: '',
		engine_capacity: undefined,
		engine_power: undefined,
		power_unit: undefined,
		transmission: undefined,
	};

	return (
		<Box maxW='800px' mx='auto' p='4'>
			<Heading mb='6' size='lg'>
				Add New Vehicle
			</Heading>
			<VehicleForm
				initialValues={initialValues}
				mutation={vehicleMutation}
				mode='create'
			/>
		</Box>
	);
};

export default NewVehiclePage;
