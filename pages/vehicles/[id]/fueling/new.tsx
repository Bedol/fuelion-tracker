import { Box, Flex, Heading } from '@chakra-ui/react';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import NewFuelingForm, {
	NewFuelingFormProps,
} from '../../../../components/fueling/NewFuelingForm';

const NewFuelingPage = ({ vehicle }: NewFuelingFormProps) => {
	return (
		<Box>
			<Flex flexDir='column' justifyContent='space-between'>
				<Heading>Add your refueling data for this vehicle</Heading>
				<Box my='4' width='600px' maxWidth='900px' mx='auto'>
					<NewFuelingForm vehicle={vehicle} />
				</Box>
			</Flex>
		</Box>
	);
};

export default NewFuelingPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params;
	const vehicleId = Number(id);

	const prisma = new PrismaClient();
	const vehicle = await prisma.vehicle.findUnique({
		where: {
			id: vehicleId,
		},
	});
	const vehicleData = JSON.parse(JSON.stringify(vehicle));

	return {
		props: {
			vehicle: vehicleData,
		},
	};
}
