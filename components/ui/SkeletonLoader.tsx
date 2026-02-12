import { Stack, Skeleton, SkeletonText, Box } from '@chakra-ui/react';

type SkeletonLoaderProps = {
	type?: 'page' | 'list' | 'card';
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'page' }) => {
	if (type === 'list') {
		return (
			<Stack gap='4'>
				{[1, 2, 3].map((i) => (
					<Box key={i} p='4' borderWidth='1px' borderRadius='md'>
						<Skeleton height='20px' width='60%' mb='2' />
						<SkeletonText noOfLines={2} />
					</Box>
				))}
			</Stack>
		);
	}

	if (type === 'card') {
		return (
			<Box p='4' borderWidth='1px' borderRadius='md'>
				<Skeleton height='150px' mb='4' />
				<SkeletonText noOfLines={3} />
			</Box>
		);
	}

	// Default: page variant
	return (
		<Stack gap='6' maxW='1200px' mx='auto'>
			<Skeleton height='40px' width='300px' />
			<Skeleton height='200px' />
			<SkeletonText noOfLines={4} />
		</Stack>
	);
};

export default SkeletonLoader;
