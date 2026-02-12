import {
	Box,
	CardBody,
	CardRoot,
	SimpleGrid,
	Skeleton,
	SkeletonText,
	Stack,
} from '@chakra-ui/react';

const DashboardSkeleton = () => {
	return (
		<Box
			maxW='1200px'
			mx='auto'
			px={{ base: '4', md: '6' }}
			py={{ base: '6', md: '8' }}
		>
			<Stack gap={{ base: '6', md: '8' }}>
				<Stack gap='3'>
					<Skeleton height='32px' width='220px' />
					<SkeletonText noOfLines={1} width='320px' />
				</Stack>
				<Stack gap={{ base: '6', md: '8' }}>
					<CardRoot variant='outline' order={{ base: 1, lg: 2 }}>
						<CardBody>
							<Stack gap='4'>
								<Skeleton height='20px' width='180px' />
								<Stack gap='3'>
									{[1, 2, 3].map((item) => (
										<Box key={item}>
											<Skeleton height='16px' width='45%' mb='2' />
											<Skeleton height='12px' />
										</Box>
									))}
								</Stack>
							</Stack>
						</CardBody>
					</CardRoot>
					<CardRoot variant='outline' order={{ base: 2, lg: 1 }}>
						<CardBody>
							<Stack gap='4'>
								<Skeleton height='20px' width='140px' />
								<SimpleGrid columns={{ base: 1, lg: 2 }} gap='4'>
									{[1, 2].map((item) => (
										<Box key={item} borderWidth='1px' borderRadius='md' p='4'>
											<Skeleton height='18px' width='60%' mb='3' />
											<SkeletonText noOfLines={3} mb='4' />
											<Skeleton height='32px' />
										</Box>
									))}
								</SimpleGrid>
							</Stack>
						</CardBody>
					</CardRoot>
				</Stack>
			</Stack>
		</Box>
	);
};

export default DashboardSkeleton;
