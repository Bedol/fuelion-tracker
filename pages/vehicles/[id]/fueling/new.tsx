import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import NewFuelingForm, {
	NewFuelingFormProps,
} from '../../../../components/fueling/NewFuelingForm';

const NewFuelingPage = ({ vehicle }: NewFuelingFormProps) => {
	return (
		<div>
			<h2 className='text-2xl'>Add your refueling data for this vehicle</h2>
			<div className='space-y-12'>
				<NewFuelingForm vehicle={vehicle} />
			</div>
		</div>
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
};
