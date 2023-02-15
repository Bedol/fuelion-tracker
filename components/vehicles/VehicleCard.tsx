import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	Heading,
	Image,
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
		<Card
			direction={{ base: 'column', sm: 'row' }}
			overflow='hidden'
			variant='outline'
			mb='3'
		>
			<Image
				objectFit='cover'
				maxW={{ base: '100%', sm: '200px' }}
				src='https://images.unsplash.com/photo-1525264626954-d57032a1ab1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=961&q=80'
				alt={data.brand}
			/>

			<Stack>
				<CardBody width={{ base: '200px', lg: '900px', md: '640px' }}>
					<Heading size='md' mb='3'>
						{data.brand} {data.model}
					</Heading>

					<SimpleGrid columns={{ sm: 1, md: 4, lg: 6 }} spacing={6}>
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
