import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Vehicle } from '@prisma/client';
import {
	FuelingList,
	FuelingDeleteModal,
} from '../../../../components/fueling';
import { FuelingData } from '../../../../types';
import FetchDataErrorAlert from '../../../../components/errors/FetchDataErrorAlert';
import Loading from '../../../../components/Loading';
import { useLocale } from '../../../../contexts/LocaleContext';
import { useSession } from 'next-auth/react';

const FuelingsListPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { locale, t } = useLocale();
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

	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';

	// Loading states
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

	return (
		<Box maxW='1000px' mx='auto' p='4'>
			<Box maxW='820px' mx='auto' w='full'>
				<Box mb='6'>
					<Heading size='xl' mb='2'>
						{vehicle.brand_name} {vehicle.model_name}
					</Heading>
					<Text color='gray.600'>
						{vehicle.production_year} •{' '}
						{vehicle.mileage.toLocaleString(localeCode)} {vehicle.mileage_unit}
					</Text>
				</Box>

				<Stack direction={{ base: 'column', sm: 'row' }} mb='6' gap='3'>
					<Button
						colorPalette='blue'
						w={{ base: 'full', sm: 'auto' }}
						onClick={handleAddFueling}
						cursor='pointer'
					>
						{t('fuelings.actions.addFueling')}
					</Button>
					<Button
						variant='ghost'
						w={{ base: 'full', sm: 'auto' }}
						onClick={() => router.push(`/vehicles/${id}`)}
						cursor='pointer'
					>
						← {t('fuelings.actions.backToVehicle')}
					</Button>
				</Stack>
			</Box>

			<FuelingList
				vehicleId={vehicle.id}
				currency={vehicle.currency}
				onEdit={handleEditFueling}
				onDelete={handleDeleteClick}
				onAddNew={handleAddFueling}
			/>

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
		</Box>
	);
};

export default FuelingsListPage;
