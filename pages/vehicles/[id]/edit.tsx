import { Box, Heading, useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FetchDataErrorAlert from '../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../components/Loading';
import VehicleForm from '../../../components/vehicles/VehicleForm';

const EditVehiclePage = ({ vehicleId }: { vehicleId: number }) => {
	const queryClient = useQueryClient();
	const toast = useToast();
	const { isLoading, isError, data } = useQuery(
		['vehicle', vehicleId],
		async () => {
			const resp = await fetch(`/api/vehicles/${vehicleId}`);
			if (!resp.ok) throw new Error('An error occurred.');
			return resp.json();
		}
	);

	const vehicleMutation = useMutation(
		async (values) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			const resp = await fetch(`/api/vehicles/${vehicleId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});
			if (!resp.ok) throw new Error('An error occurred.');
			return resp.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['vehicle', vehicleId]);
				toast({
					title: 'Vehicle updated.',
					position: 'top-right',
					status: 'success',
					duration: 5000,
					isClosable: true,
					containerStyle: {
						zIndex: 999,
						marginTop: '5rem',
					},
				});
			},
		}
	);

	if (isLoading) return <Loading />;
	if (isError)
		return (
			<FetchDataErrorAlert errorMessage='An error occurred while fetching data' />
		);

	const { brand, model, production_year } = data;

	return (
		<Box>
			<Heading mb='3'>Edit Vehicle</Heading>
			<VehicleForm
				initialValues={{ brand, model, production_year }}
				mutation={vehicleMutation}
			/>
		</Box>
	);
};

export default EditVehiclePage;

export async function getServerSideProps(context) {
	const { id } = context.params;
	const vehicleId = parseInt(id);

	return {
		props: {
			vehicleId,
		},
	};
}
