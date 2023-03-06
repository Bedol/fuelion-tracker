import { Flex } from '@chakra-ui/react';
import ChartsSection from '../../../components/statistics/ChartsSection';
import VehicleCard from '../../../components/vehicles/VehicleCard';

const VehicleStatisticsPage = ({ id }) => {
	return (
		<Flex flexDir='column' alignItems='center'>
			<VehicleCard vehicleId={id} />
			<ChartsSection />
		</Flex>
	);
};

export default VehicleStatisticsPage;

export async function getServerSideProps(context) {
	const { id } = context.params;
	return {
		props: {
			id: id,
		},
	};
}
