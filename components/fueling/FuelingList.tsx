import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box, Button, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { useLocale } from '../../contexts/LocaleContext';
import { useFuelings } from '../../hooks';
import { FuelingData } from '../../types';
import SkeletonLoader from '../ui/SkeletonLoader';
import ErrorAlert from '../ui/ErrorAlert';
import FuelingListItem from './FuelingListItem';

interface FuelingListProps {
	vehicleId: number;
	currency: string;
	onEdit: (fueling: FuelingData) => void;
	onDelete: (fueling: FuelingData) => void;
	onAddNew?: () => void;
}

const FuelingList: React.FC<FuelingListProps> = ({
	vehicleId,
	currency,
	onEdit,
	onDelete,
	onAddNew,
}) => {
	const { locale, t } = useLocale();
	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending,
		isError,
		error,
	} = useFuelings(vehicleId);

	// Intersection observer for infinite scroll
	const { ref: loadMoreRef, inView } = useInView({
		threshold: 0,
		rootMargin: '100px',
	});

	// Fetch next page when scrolling into view
	useMemo(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Flatten all pages into single array
	const fuelings = useMemo(() => {
		if (!data) return [];
		return data.pages.flat();
	}, [data]);

	// Group fuelings by month
	const groupedFuelings = useMemo(() => {
		const groups: Record<string, FuelingData[]> = {};
		fuelings.forEach((fueling) => {
			const monthKey = new Date(fueling.date).toLocaleDateString(localeCode, {
				year: 'numeric',
				month: 'long',
			});
			if (!groups[monthKey]) {
				groups[monthKey] = [];
			}
			groups[monthKey].push(fueling);
		});
		return groups;
	}, [fuelings, localeCode]);

	// Loading state
	if (isPending) {
		return (
			<Box maxW='820px' mx='auto' w='full'>
				<Heading size='md' mb='4'>
					{t('fuelings.list.title')}
				</Heading>
				<SkeletonLoader type='list' />
			</Box>
		);
	}

	// Error state
	if (isError) {
		return (
			<Box maxW='820px' mx='auto' w='full'>
				<Heading size='md' mb='4'>
					{t('fuelings.list.title')}
				</Heading>
				<ErrorAlert
					error={error || new Error(t('fuelings.errors.loadFuelings'))}
				/>
			</Box>
		);
	}

	// Empty state
	if (fuelings.length === 0) {
		return (
			<Box maxW='820px' mx='auto' w='full' textAlign='center' py='12'>
				<Text fontSize='4xl' mb='4'>
					⛽
				</Text>
				<Heading size='md' mb='2'>
					{t('fuelings.list.emptyTitle')}
				</Heading>
				<Text color='gray.500' mb='6'>
					{t('fuelings.list.emptyDescription')}
				</Text>
				{onAddNew && (
					<Button colorPalette='blue' onClick={onAddNew} cursor='pointer'>
						{t('fuelings.actions.addFirstFueling')}
					</Button>
				)}
			</Box>
		);
	}

	return (
		<Box maxW='820px' mx='auto' w='full'>
			<Heading size='md' mb='4'>
				{t('fuelings.list.title')}
				<Text
					as='span'
					fontSize='sm'
					fontWeight='normal'
					color='gray.500'
					ml='2'
				>
					({fuelings.length} {t('fuelings.list.recordsLabel')})
				</Text>
			</Heading>

			<VStack gap='4' align='stretch'>
				{Object.entries(groupedFuelings).map(([month, monthFuelings]) => (
					<Box key={month}>
						<Heading
							size='sm'
							color='gray.600'
							mb='3'
							pb='2'
							borderBottomWidth='1px'
						>
							{month}
						</Heading>
						<Stack gap='3'>
							{monthFuelings.map((fueling) => (
								<FuelingListItem
									key={fueling.id}
									fueling={fueling}
									currency={currency}
									onEdit={() => onEdit(fueling)}
									onDelete={() => onDelete(fueling)}
								/>
							))}
						</Stack>
					</Box>
				))}
			</VStack>

			{/* Load more trigger */}
			{hasNextPage && (
				<Box ref={loadMoreRef} py='4' textAlign='center'>
					{isFetchingNextPage ? (
						<Text color='gray.500' fontSize='sm'>
							{t('fuelings.list.loadingMore')}
						</Text>
					) : (
						<Text color='gray.400' fontSize='sm'>
							{t('fuelings.list.scrollForMore')}
						</Text>
					)}
				</Box>
			)}

			{/* End of list indicator */}
			{!hasNextPage && fuelings.length > 10 && (
				<Box py='4' textAlign='center'>
					<Text color='gray.400' fontSize='sm'>
						{t('fuelings.list.endOfHistory')}
					</Text>
				</Box>
			)}
		</Box>
	);
};

export default FuelingList;
