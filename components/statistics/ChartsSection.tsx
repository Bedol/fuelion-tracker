import { CardBody, CardRoot, Heading, Stack, Text } from '@chakra-ui/react';
import type {
	ConsumptionPoint,
	MonthlyCostPoint,
} from '../../types/statistics_types';
import ConsumptionChart from './ConsumptionChart';
import MonthlyCostChart from './MonthlyCostChart';
import StatisticsEmptyState from './StatisticsEmptyState';

type ChartsSectionProps = {
	consumption: ConsumptionPoint[];
	monthlyCosts: MonthlyCostPoint[];
	currency: string;
	hasConsumptionData: boolean;
	hasCostData: boolean;
};

const ChartsSection: React.FC<ChartsSectionProps> = ({
	consumption,
	monthlyCosts,
	currency,
	hasConsumptionData,
	hasCostData,
}) => {
	return (
		<Stack gap='4'>
			<CardRoot variant='outline'>
				<CardBody>
					<Heading size='md' mb='1'>
						Consumption Trend
					</Heading>
					<Text color='gray.500' mb='4'>
						Monthly L/100km averages from full-tank intervals.
					</Text>
					{hasConsumptionData ? (
						<ConsumptionChart
							data={consumption}
							isEmpty={consumption.length === 0}
						/>
					) : (
						<StatisticsEmptyState
							title='Not enough consumption data'
							description='Add at least two full-tank fuelings to calculate accurate consumption.'
							icon='⛽'
						/>
					)}
				</CardBody>
			</CardRoot>
			<CardRoot variant='outline'>
				<CardBody>
					<Heading size='md' mb='1'>
						Monthly Fuel Costs
					</Heading>
					<Text color='gray.500' mb='4'>
						Rolling 12-month spend in {currency} with the current month in
						progress.
					</Text>
					{hasCostData ? (
						<MonthlyCostChart data={monthlyCosts} currency={currency} />
					) : (
						<StatisticsEmptyState
							title='No monthly costs yet'
							description='Record fuelings to see monthly fuel costs here.'
							icon='🧾'
						/>
					)}
				</CardBody>
			</CardRoot>
		</Stack>
	);
};

export default ChartsSection;
