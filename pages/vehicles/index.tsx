import { Vehicle } from '@prisma/client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import FetchDataErrorAlert from '../../components/errors/FetchDataErrorAlert';
import Loading from '../../components/Loading';
import VehicleCard from '../../components/VehicleCard';

const EmptyState = () => {
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
			<Link
				href='/vehicles/new'
				className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md'
			>
				Add Vehicle
			</Link>
		</div>
	);
};

const AllVehicles = () => {
	const { isPending, isError, data } = useQuery({
		queryKey: ['vehicles'],
		queryFn: async () => {
			const result = await fetch('/api/vehicles');
			return result.json();
		},
	});

	if (isPending) return <Loading />;

	if (isError)
		return (
			<FetchDataErrorAlert errorMessage='An error occurred while fetching vehicles.' />
		);

	// Empty state when no vehicles exist
	if (!data || data.length === 0) {
		return <EmptyState />;
	}

	return (
		<div>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-2xl font-bold text-gray-900'>My Vehicles</h1>
				<Link
					href='/vehicles/new'
					className='px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
				>
					Add Vehicle
				</Link>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{data.map((vehicle: Vehicle) => (
					<VehicleCard key={vehicle.id} vehicle={vehicle} />
				))}
			</div>
		</div>
	);
};

export default AllVehicles;
