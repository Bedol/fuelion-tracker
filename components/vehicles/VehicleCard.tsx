import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	Heading,
	SimpleGrid,
	Stack,
	Stat,
	StatLabel,
	StatNumber,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaGasPump } from 'react-icons/fa';
import { useQuery } from 'react-query';

const VehicleCard = ({ vehicleId }) => {
	const { data, isLoading, isError } = useQuery('vehicle', async () => {
		const result = await fetch(`/api/vehicles/${vehicleId}`);
		return result.json();
	});

	if (isLoading) return <Box>Loading...</Box>;

	if (isError) return <Box>Error</Box>;

	return (
		<Card mb='3'>
			<Stack>
				<CardBody width={{ base: '200px', lg: '900px', md: '640px' }}>
					<Heading size='md' mb='3'>
						{data.brand} {data.model}
					</Heading>

					<SimpleGrid columns={{ sm: 1, md: 4, lg: 6 }} spacing={6}>
						<Stat>
							<StatLabel>Capacity</StatLabel>
							<StatNumber>{data.engine_capacity}</StatNumber>
						</Stat>

						<Stat>
							<StatLabel>Production Year</StatLabel>
							<StatNumber>{data.production_year}</StatNumber>
						</Stat>

						<Stat>
							<StatLabel>Mileage</StatLabel>
							<StatNumber>{data.mileage}</StatNumber>
						</Stat>

						<Stat>
							<StatLabel>Fuel Type</StatLabel>
							<StatNumber>{data.fuel_type || 'benzine'}</StatNumber>
						</Stat>

						<Stat>
							<StatLabel>Gearbox</StatLabel>
							<StatNumber>{data.gearbox || 'unknown'}</StatNumber>
						</Stat>

						<Stat>
							<StatLabel>Power</StatLabel>
							<StatNumber>
								{data.power} {data.power_unit || 'hp'}
							</StatNumber>
						</Stat>
					</SimpleGrid>
				</CardBody>

				<CardFooter>
					<Button
						as={NextLink}
						href={`/vehicles/${vehicleId}/fueling/new`}
						aria-label='Add fueling'
						colorScheme='green'
						rightIcon={<FaGasPump />}
					>
						Add fueling
					</Button>
				</CardFooter>
			</Stack>
		</Card>
	);
};

export default VehicleCard;
