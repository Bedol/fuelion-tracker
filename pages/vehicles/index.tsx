import { Vehicle } from '@prisma/client';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import FetchDataErrorAlert from '../../components/errors/FetchDataErrorAlert';
import Loading from '../../components/Loading';
import VehicleCard from '../../components/VehicleCard';

const EmptyState = () => {
	const router = useRouter();
	return (
		<div className='flex flex-col items-center justify-center min-h-[400px] px-4'>
			<div className='text-6xl mb-6'>🚗</div>
			<h2 className='text-2xl font-bold text-gray-900 mb-3'>
				Add your first vehicle
			</h2>
			<p className='text-gray-600 text-center mb-8 max-w-md'>
				Start tracking fuel expenses by adding your vehicle. Keep all your car
				costs in one place.
			</p>
			<Button
				colorPalette='blue'
				size='lg'
				onClick={() => router.push('/vehicles/new')}
				cursor='pointer'
			>
				Add Vehicle
			</Button>
		</div>
	);
};

const AllVehicles = () => {
	const router = useRouter();
	const { isPending, isError, data } = useQuery({
		queryKey: ['vehicles'],
		queryFn: async () => {
			const result = await fetch('/api/vehicles');
			return result.json();
		},
	});

	if (isPending)
		return (
			<Layout>
				<Loading />
			</Layout>
		);

	if (isError)
		return (
			<Layout>
				<FetchDataErrorAlert errorMessage='An error occurred while fetching vehicles.' />
			</Layout>
		);

	// Empty state when no vehicles exist
	if (!data || data.length === 0) {
		return (
			<Layout>
				<EmptyState />
			</Layout>
		);
	}

	return (
		<Layout>
			<div>
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-2xl font-bold text-gray-900'>My Vehicles</h1>
					<Button
						colorPalette='blue'
						onClick={() => router.push('/vehicles/new')}
						cursor='pointer'
					>
						Add Vehicle
					</Button>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{data.map((vehicle: Vehicle) => (
						<VehicleCard key={vehicle.id} vehicle={vehicle} />
					))}
				</div>
			</div>
		</Layout>
	);
};

export default AllVehicles;
