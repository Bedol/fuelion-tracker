import { Box, Text } from '@chakra-ui/react';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import type { ConsumptionPoint } from '../../types/statistics_types';

type ConsumptionChartProps = {
	data: ConsumptionPoint[];
	isEmpty: boolean;
};

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({
	data,
	isEmpty,
}) => {
	const numberFormatter = new Intl.NumberFormat('pl-PL', {
		maximumFractionDigits: 1,
	});

	if (isEmpty) {
		return (
			<Box
				height='16rem'
				display='flex'
				alignItems='center'
				justifyContent='center'
			>
				<Text color='gray.500'>Not enough data for consumption chart.</Text>
			</Box>
		);
	}

	return (
		<Box height='16rem'>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart data={data} margin={{ top: 10, right: 20, left: 0 }}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='month' tickLine={false} />
					<YAxis tickLine={false} axisLine={false} domain={['auto', 'auto']} />
					<Tooltip
						formatter={(value: number) => [
							`${numberFormatter.format(value)} L/100km`,
							'Consumption',
						]}
					/>
					<Line
						type='linear'
						dataKey='value'
						stroke='var(--chakra-colors-blue-500)'
						strokeWidth={2}
						dot={{ r: 4 }}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default ConsumptionChart;
