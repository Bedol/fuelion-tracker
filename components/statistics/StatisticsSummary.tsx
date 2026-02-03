import {
	CardBody,
	CardRoot,
	Heading,
	SimpleGrid,
	Text,
} from '@chakra-ui/react';
import type { StatisticsSummary as SummaryData } from '../../types/statistics_types';

type StatisticsSummaryProps = {
	summary: SummaryData;
	currency: string;
};

const StatisticsSummary: React.FC<StatisticsSummaryProps> = ({
	summary,
	currency,
}) => {
	const currencyFormatter = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency,
	});
	const numberFormatter = new Intl.NumberFormat('pl-PL', {
		maximumFractionDigits: 1,
	});
	const distanceFormatter = new Intl.NumberFormat('pl-PL');

	const formattedConsumption =
		summary.averageConsumption === null
			? '--'
			: `${numberFormatter.format(summary.averageConsumption)} L/100km`;
	const formattedDistance =
		summary.totalDistance === null
			? '--'
			: `${distanceFormatter.format(summary.totalDistance)} km`;

	return (
		<SimpleGrid columns={{ base: 1, md: 3 }} gap='4'>
			<CardRoot variant='outline'>
				<CardBody>
					<Text fontSize='sm' color='gray.500' mb='2'>
						Total Spent
					</Text>
					<Heading size='lg'>
						{currencyFormatter.format(summary.totalSpent)}
					</Heading>
				</CardBody>
			</CardRoot>
			<CardRoot variant='outline'>
				<CardBody>
					<Text fontSize='sm' color='gray.500' mb='2'>
						Average Consumption
					</Text>
					<Heading size='lg'>{formattedConsumption}</Heading>
					{summary.averageConsumption === null && (
						<Text fontSize='sm' color='gray.500' mt='2'>
							Need more full-tank data
						</Text>
					)}
				</CardBody>
			</CardRoot>
			<CardRoot variant='outline'>
				<CardBody>
					<Text fontSize='sm' color='gray.500' mb='2'>
						Total Distance
					</Text>
					<Heading size='lg'>{formattedDistance}</Heading>
					{summary.totalDistance === null && (
						<Text fontSize='sm' color='gray.500' mt='2'>
							Not enough interval data
						</Text>
					)}
				</CardBody>
			</CardRoot>
		</SimpleGrid>
	);
};

export default StatisticsSummary;
