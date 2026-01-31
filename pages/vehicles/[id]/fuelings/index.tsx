import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Vehicle } from '@prisma/client';
import Layout from '../../../../components/Layout';
import {
	FuelingList,
	FuelingDeleteModal,
} from '../../../../components/fueling';
import { FuelingData } from '../../../../types';
import FetchDataErrorAlert from '../../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../../components/Loading';
import { useSession } from 'next-auth/react';

const FuelingsListPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { status } = useSession({ required: true });

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedFueling, setSelectedFueling] = useState<FuelingData | null>(
		null
	);

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

	// Handlers
	const handleAddFueling = () => {
		if (vehicleId) {
			router.push(`/vehicles/${vehicleId}/fuelings/new`);
		}
	};

	const handleEditFueling = (fueling: FuelingData) => {
		router.push(`/vehicles/${id}/fuelings/${fueling.id}/edit`);
	};

	const handleDeleteClick = (fueling: FuelingData) => {
		setSelectedFueling(fueling);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteSuccess = () => {
		setIsDeleteModalOpen(false);
		setSelectedFueling(null);
	};

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedFueling(null);
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
						{vehicle.brand_name} {vehicle.model_name}
					</Heading>
					<Text color='gray.600'>
						{vehicle.production_year} • {vehicle.mileage.toLocaleString()}{' '}
						{vehicle.mileage_unit}
					</Text>
				</Box>

				{/* Action Buttons */}
				<Stack direction='row' mb='6' gap='4'>
					<Button
						colorPalette='blue'
						onClick={handleAddFueling}
						cursor='pointer'
					>
						Add Fueling
					</Button>
					<Button
						variant='ghost'
						onClick={() => router.push(`/vehicles/${id}`)}
						cursor='pointer'
					>
						← Back to Vehicle
					</Button>
				</Stack>

				{/* Fueling List */}
				<FuelingList
					vehicleId={vehicle.id}
					currency={vehicle.currency}
					onEdit={handleEditFueling}
					onDelete={handleDeleteClick}
					onAddNew={handleAddFueling}
				/>
			</Box>

			{/* Delete Modal */}
			{selectedFueling && (
				<FuelingDeleteModal
					isOpen={isDeleteModalOpen}
					onClose={handleCloseDeleteModal}
					fueling={{
						id: selectedFueling.id,
						date: selectedFueling.date,
						cost: selectedFueling.cost,
					}}
					currency={vehicle.currency}
					onDeleteSuccess={handleDeleteSuccess}
					vehicleId={vehicle.id}
				/>
			)}
		</Layout>
	);
};

export default FuelingsListPage;
