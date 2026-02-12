import { Box, Heading } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import VehicleForm from '../../../components/vehicles/VehicleForm';
import { toaster } from '../../../components/ui/toaster';
import { useLocale } from '../../../contexts/LocaleContext';
import FetchDataErrorAlert from '../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../components/Loading';

const EditVehiclePage = ({ vehicleId }: { vehicleId: number }) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { t } = useLocale();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth/signin');
		},
	});

	const { isPending, isError, data } = useQuery({
		queryKey: ['vehicle', vehicleId],
		queryFn: async () => {
			const resp = await fetch(`/api/vehicles/${vehicleId}`);
			if (!resp.ok) throw new Error(t('vehicles.form.errors.generic'));
			return resp.json();
		},
		enabled: status === 'authenticated',
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
				throw new Error(
					error.message || t('vehicles.form.errors.updateFailed')
				);
			}

			return resp.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId] });
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			toaster.create({
				title: t('vehicles.form.toasts.updateSuccess'),
				type: 'success',
				duration: 6000,
				closable: true,
			});
			router.push(`/vehicles/${vehicleId}`);
		},
		onError: (error) => {
			toaster.create({
				title:
					error instanceof Error
						? error.message
						: t('vehicles.form.toasts.updateError'),
				type: 'error',
			});
		},
	});

	if (status === 'loading') return <Loading />;
	if (isPending) return <Loading />;
	if (isError)
		return (
			<FetchDataErrorAlert
				errorMessage={t('vehicles.form.errors.loadVehicleData')}
			/>
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
				{t('vehicles.form.titles.editVehicle')}
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
