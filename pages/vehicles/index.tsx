import { Vehicle } from '@prisma/client';
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

	console.log(data);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{data.map((vehicle: Vehicle) => (
				<VehicleCard key={vehicle.id} vehicle={vehicle} />
			))}
		</div>
	);
};

export default AllVehicles;
