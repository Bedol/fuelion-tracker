import { Vehicle } from '@prisma/client';
import Link from 'next/link';
import { useQuery } from 'react-query';
import FetchDataErrorAlert from '../../components/errors/FetchDataErrorAlert';
import Loading from '../../components/Loading';
import VehicleCard from '../../components/VehicleCard';

const AllVehicles = () => {
	const { isLoading, isError, data } = useQuery('vehicles', async () => {
		const result = await fetch('/api/vehicles');
		return result.json();
	});

	if (isLoading) return <Loading />;

	if (isError)
		return (
			<FetchDataErrorAlert errorMessage='An error occurred while fetching vehicles.' />
		);

	return (
		<div>
			<button className='px-4 py-2 my-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
				<Link href='/vehicles/new'>Add vehicle</Link>
			</button>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{data.map((vehicle: Vehicle) => (
					<VehicleCard key={vehicle.id} vehicle={vehicle} />
				))}
			</div>
		</div>
	);
};

export default AllVehicles;
