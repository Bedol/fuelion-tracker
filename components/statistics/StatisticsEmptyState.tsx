import { Box, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type StatisticsEmptyStateProps = {
	title: string;
	description: string;
	icon?: ReactNode;
};

const StatisticsEmptyState: React.FC<StatisticsEmptyStateProps> = ({
	title,
	description,
	icon,
}) => {
	return (
		<Box textAlign='center' py='10'>
			<Text fontSize='4xl' mb='3'>
				{icon || '📉'}
			</Text>
			<Heading size='md' mb='2'>
				{title}
			</Heading>
			<Text color='gray.500' maxW='340px' mx='auto'>
				{description}
			</Text>
		</Box>
	);
};

export default StatisticsEmptyState;
