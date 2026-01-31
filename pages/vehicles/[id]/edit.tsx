import { Box, Heading } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import VehicleForm from '../../../components/vehicles/VehicleForm';
import { toaster } from '../../../components/ui/toaster';
import FetchDataErrorAlert from '../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../components/Loading';

const EditVehiclePage = ({ vehicleId }: { vehicleId: number }) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { isPending, isError, data } = useQuery({
		queryKey: ['vehicle', vehicleId],
		queryFn: async () => {
			const resp = await fetch(`/api/vehicles/${vehicleId}`);
			if (!resp.ok) throw new Error('An error occurred.');
			return resp.json();
		},
	});

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
			const resp = await fetch(`/api/vehicles/${vehicleId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			if (!resp.ok) {
				const error = await resp.json();
				throw new Error(error.message || 'Failed to update vehicle');
			}

			return resp.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId] });
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
			toaster.create({
				title: 'Vehicle updated successfully',
				type: 'success',
			});
			router.push('/vehicles');
		},
		onError: (error) => {
			toaster.create({
				title:
					error instanceof Error ? error.message : 'Failed to update vehicle',
				type: 'error',
			});
		},
	});

	if (isPending) return <Loading />;
	if (isError)
		return (
			<FetchDataErrorAlert errorMessage='An error occurred while fetching vehicle data.' />
		);

	// Map all fields from API response to form initial values
	const initialValues = {
		brand_name: data.brand_name || '',
		model_name: data.model_name || '',
		production_year: data.production_year || new Date().getFullYear(),
		fuel_type: data.fuel_type || 'gasoline',
		registration_number: data.registration_number || '',
		engine_capacity: data.engine_capacity,
		engine_power: data.engine_power,
		power_unit: data.power_unit,
		transmission: data.transmission,
	};

	return (
		<Box maxW='800px' mx='auto' p='4'>
			<Heading mb='6' size='lg'>
				Edit Vehicle
			</Heading>
			<VehicleForm
				initialValues={initialValues}
				mutation={vehicleMutation}
				mode='edit'
			/>
		</Box>
	);
};

export default EditVehiclePage;

export async function getServerSideProps(context: { params: { id: string } }) {
	const { id } = context.params;
	const vehicleId = parseInt(id);

	return {
		props: {
			vehicleId,
		},
	};
}
