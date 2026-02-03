import { Box, Text } from '@chakra-ui/react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import type { MonthlyCostPoint } from '../../types/statistics_types';

type MonthlyCostChartProps = {
	data: MonthlyCostPoint[];
	currency: string;
};

const MonthlyCostChart: React.FC<MonthlyCostChartProps> = ({
	data,
	currency,
}) => {
	const currencyFormatter = new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0,
	});

	if (data.length === 0) {
		return (
			<Box
				height='16rem'
				display='flex'
				alignItems='center'
				justifyContent='center'
			>
				<Text color='gray.500'>No monthly costs to display.</Text>
			</Box>
		);
	}

	return (
		<Box height='16rem'>
			<ResponsiveContainer width='100%' height='100%'>
				<BarChart data={data} margin={{ top: 10, right: 20, left: 0 }}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='month' tickLine={false} />
					<YAxis tickLine={false} axisLine={false} />
					<Tooltip
						formatter={(value: number) => [
							currencyFormatter.format(value),
							'Total cost',
						]}
					/>
					<Bar dataKey='value' fill='var(--chakra-colors-orange-400)' />
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default MonthlyCostChart;
