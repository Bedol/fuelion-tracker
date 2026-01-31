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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaGasPump } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

const VehicleCard = ({ vehicleId }) => {
	const { data, isPending, isError } = useQuery({
		queryKey: ['vehicle', vehicleId],
		queryFn: async () => {
			const result = await fetch(`/api/vehicles/${vehicleId}`);
			return result.json();
		},
	});

	if (isPending) return <Box>Loading...</Box>;

	if (isError) return <Box>Error</Box>;

	return (
		// @ts-ignore - Chakra v3 Card namespace
		<Card.Root mb='3'>
			<Stack>
				<CardBody width={{ base: '200px', lg: '900px', md: '640px' }}>
					<Heading size='md' mb='3'>
						{data.brand} {data.model}
					</Heading>

					<SimpleGrid columns={{ sm: 1, md: 4, lg: 6 }} gap={6}>
						{/* @ts-ignore */}
						<Stat.Root>
							{/* @ts-ignore */}
							<Stat.Label>Capacity</Stat.Label>
							{/* @ts-ignore */}
							<Stat.ValueText>{data.engine_capacity}</Stat.ValueText>
						</Stat.Root>

						{/* @ts-ignore */}
						<Stat.Root>
							{/* @ts-ignore */}
							<Stat.Label>Production Year</Stat.Label>
							{/* @ts-ignore */}
							<Stat.ValueText>{data.production_year}</Stat.ValueText>
						</Stat.Root>

						{/* @ts-ignore */}
						<Stat.Root>
							{/* @ts-ignore */}
							<Stat.Label>Mileage</Stat.Label>
							{/* @ts-ignore */}
							<Stat.ValueText>{data.mileage}</Stat.ValueText>
						</Stat.Root>

						{/* @ts-ignore */}
						<Stat.Root>
							{/* @ts-ignore */}
							<Stat.Label>Fuel Type</Stat.Label>
							{/* @ts-ignore */}
							<Stat.ValueText>{data.fuel_type || 'benzine'}</Stat.ValueText>
						</Stat.Root>

						{/* @ts-ignore */}
						<Stat.Root>
							{/* @ts-ignore */}
							<Stat.Label>Gearbox</Stat.Label>
							{/* @ts-ignore */}
							<Stat.ValueText>{data.gearbox || 'unknown'}</Stat.ValueText>
						</Stat.Root>

						{/* @ts-ignore */}
						<Stat.Root>
							{/* @ts-ignore */}
							<Stat.Label>Power</Stat.Label>
							{/* @ts-ignore */}
							<Stat.ValueText>
								{data.power} {data.power_unit || 'hp'}
							</Stat.ValueText>
						</Stat.Root>
					</SimpleGrid>
				</CardBody>

				<CardFooter>
					<NextLink
						href={`/vehicles/${vehicleId}/fueling/new`}
						passHref
						legacyBehavior
					>
						<Button as='a' aria-label='Add fueling' colorPalette='green'>
							<FaGasPump />
							Add fueling
						</Button>
					</NextLink>
				</CardFooter>
			</Stack>
		</Card.Root>
	);
};

export default VehicleCard;
