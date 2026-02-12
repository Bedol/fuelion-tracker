import { Box, Heading } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import VehicleForm from '../../components/vehicles/VehicleForm';
import { toaster } from '../../components/ui/toaster';
import { useLocale } from '../../contexts/LocaleContext';
import Loading from '../../components/Loading';

const NewVehiclePage = () => {
	const router = useRouter();
	const { t } = useLocale();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth/signin');
		},
	});
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
				throw new Error(t('vehicles.form.errors.userNotAuthenticated'));
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
				throw new Error(
					error.message || t('vehicles.form.errors.createFailed')
				);
			}

			return resp.json();
		},
		onSuccess: (createdVehicle: { id: number }) => {
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
			toaster.create({
				title: t('vehicles.form.toasts.createSuccess'),
				type: 'success',
				duration: 6000,
				closable: true,
			});
			router.push(`/vehicles/${createdVehicle.id}`);
		},
		onError: (error) => {
			toaster.create({
				title:
					error instanceof Error
						? error.message
						: t('vehicles.form.toasts.createError'),
				type: 'error',
			});
		},
	});

	if (status === 'loading') {
		return <Loading />;
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
				{t('vehicles.form.titles.addNewVehicle')}
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
