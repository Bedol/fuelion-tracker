import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

const VehicleStatisticsPage = ({ id }) => {
	const router = useRouter();
	const { data, isLoading, isError } = useQuery('vehicle', async () => {
		const result = await fetch(`/api/vehicles/${id}`);
		return result.json();
	});

	if (isLoading) return <div>Loading...</div>;

	if (isError) return <div>Error</div>;

	const handleAddRefueling = () => {
		router.push(`/vehicles/${id}/fueling/new`);
	};

	return (
		<div>
			<section className='bg-white p-4 mb-4'>
				<h2 className='text-2xl font-bold mb-2'>Vehicle details</h2>
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<p>Nazwa marki: {data.brand_name}</p>
						<p>Nazwa modelu: {data.model_name}</p>
						<p>Pojemność silnika: {data.engine_capacity}</p>
						<p>Rok produkcji: {data.production_year}</p>
					</div>
					<div>
						<p>Typ paliwa: {data.fuel_type_id}</p>
						<p>Moc silnika: {data.engine_power}</p>
						<p>Przebieg: {data.mileage}</p>
					</div>
				</div>
			</section>

			<section className='bg-white p-4 mb-4'>
				<h2 className='text-2xl font-bold mb-2'>Statistics</h2>
				{/* Komponenty dla statystyk */}
			</section>

			<section className='bg-white p-4'>
				<h2 className='text-2xl font-bold mb-2'>Fuelings</h2>
				{/* Komponent dla tabelki z wpisami tankowań */}
				<button
					className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
					onClick={handleAddRefueling}
				>
					Add fueling
				</button>
			</section>
		</div>
	);
};

export default VehicleStatisticsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params;
	return {
		props: {
			id: id,
		},
	};
};
