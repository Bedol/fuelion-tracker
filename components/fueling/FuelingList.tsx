import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
	Box,
	Button,
	Heading,
	HStack,
	Input,
	Menu,
	Portal,
	SimpleGrid,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
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
	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');
	const [tankFilter, setTankFilter] = useState<'all' | 'full' | 'partial'>(
		'all'
	);
	const [fuelTypeFilter, setFuelTypeFilter] = useState('all');
	const [density, setDensity] = useState<'comfortable' | 'compact'>(
		'comfortable'
	);

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
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Flatten all pages into single array
	const fuelings = useMemo(() => {
		if (!data) return [];
		return data.pages.flat();
	}, [data]);

	const availableFuelTypes = useMemo(() => {
		const unique = new Set(
			fuelings
				.map((fueling) => fueling.fuel_type)
				.filter(
					(fuelType): fuelType is string =>
						typeof fuelType === 'string' && fuelType.trim() !== ''
				)
		);
		return Array.from(unique).sort();
	}, [fuelings]);

	const filteredFuelings = useMemo(() => {
		return fuelings.filter((fueling) => {
			const fuelingDate = new Date(fueling.date);

			if (dateFrom) {
				const from = new Date(`${dateFrom}T00:00:00`);
				if (fuelingDate < from) return false;
			}

			if (dateTo) {
				const to = new Date(`${dateTo}T23:59:59.999`);
				if (fuelingDate > to) return false;
			}

			if (tankFilter === 'full' && !fueling.full_tank) return false;
			if (tankFilter === 'partial' && fueling.full_tank) return false;

			if (fuelTypeFilter !== 'all' && fueling.fuel_type !== fuelTypeFilter) {
				return false;
			}

			return true;
		});
	}, [fuelings, dateFrom, dateTo, tankFilter, fuelTypeFilter]);

	const hasActiveFilters =
		dateFrom !== '' ||
		dateTo !== '' ||
		tankFilter !== 'all' ||
		fuelTypeFilter !== 'all';

	const getFuelTypeLabel = (fuelType: string) => {
		const translatedFuelType = t(`vehicles.fuelTypes.${fuelType}`);
		return translatedFuelType.startsWith('vehicles.fuelTypes.')
			? fuelType
			: translatedFuelType;
	};

	const tankFilterLabel =
		tankFilter === 'all'
			? t('fuelings.filters.options.all')
			: tankFilter === 'full'
				? t('fuelings.filters.options.fullTank')
				: t('fuelings.filters.options.partialTank');

	const fuelTypeFilterLabel =
		fuelTypeFilter === 'all'
			? t('fuelings.filters.options.all')
			: getFuelTypeLabel(fuelTypeFilter);

	const monthSectionGap = density === 'compact' ? '2' : '3';

	// Group fuelings by month
	const groupedFuelings = useMemo(() => {
		const groups: Record<string, FuelingData[]> = {};
		filteredFuelings.forEach((fueling) => {
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
	}, [filteredFuelings, localeCode]);

	const visibleSummary = useMemo(() => {
		const totalCost = filteredFuelings.reduce(
			(acc, fueling) => acc + fueling.cost,
			0
		);
		const totalQuantity = filteredFuelings.reduce(
			(acc, fueling) => acc + fueling.quantity,
			0
		);
		const avgPricePerLiter = totalQuantity > 0 ? totalCost / totalQuantity : 0;

		return {
			count: filteredFuelings.length,
			totalCost,
			avgPricePerLiter,
		};
	}, [filteredFuelings]);

	const currencyFormatter = useMemo(
		() =>
			new Intl.NumberFormat(localeCode, {
				style: 'currency',
				currency,
			}),
		[localeCode, currency]
	);

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
					({filteredFuelings.length}
					{hasActiveFilters && `/${fuelings.length}`}{' '}
					{t('fuelings.list.recordsLabel')})
				</Text>
			</Heading>

			<Stack
				direction={{ base: 'column', md: 'row' }}
				gap='3'
				mb='4'
				align='end'
			>
				<Box w='full'>
					<Text fontSize='xs' color='gray.500' mb='1'>
						{t('fuelings.filters.dateFrom')}
					</Text>
					<Input
						type='date'
						value={dateFrom}
						onChange={(event) => setDateFrom(event.target.value)}
						size='sm'
					/>
				</Box>

				<Box w='full'>
					<Text fontSize='xs' color='gray.500' mb='1'>
						{t('fuelings.filters.dateTo')}
					</Text>
					<Input
						type='date'
						value={dateTo}
						onChange={(event) => setDateTo(event.target.value)}
						size='sm'
					/>
				</Box>

				<Box w='full'>
					<Text fontSize='xs' color='gray.500' mb='1'>
						{t('fuelings.filters.tankType')}
					</Text>
					{/* @ts-ignore */}
					<Menu.Root positioning={{ placement: 'bottom-start' }}>
						{/* @ts-ignore */}
						<Menu.Trigger asChild>
							<Button
								variant='outline'
								size='sm'
								w='full'
								justifyContent='space-between'
							>
								{tankFilterLabel}
								<span>▾</span>
							</Button>
						</Menu.Trigger>
						<Portal>
							{/* @ts-ignore */}
							<Menu.Positioner>
								{/* @ts-ignore */}
								<Menu.Content>
									{/* @ts-ignore */}
									<Menu.Item value='all' onClick={() => setTankFilter('all')}>
										{t('fuelings.filters.options.all')}
									</Menu.Item>
									{/* @ts-ignore */}
									<Menu.Item value='full' onClick={() => setTankFilter('full')}>
										{t('fuelings.filters.options.fullTank')}
									</Menu.Item>
									{/* @ts-ignore */}
									<Menu.Item
										value='partial'
										onClick={() => setTankFilter('partial')}
									>
										{t('fuelings.filters.options.partialTank')}
									</Menu.Item>
								</Menu.Content>
							</Menu.Positioner>
						</Portal>
					</Menu.Root>
				</Box>

				<Box w='full'>
					<Text fontSize='xs' color='gray.500' mb='1'>
						{t('fuelings.filters.fuelType')}
					</Text>
					{/* @ts-ignore */}
					<Menu.Root positioning={{ placement: 'bottom-start' }}>
						{/* @ts-ignore */}
						<Menu.Trigger asChild>
							<Button
								variant='outline'
								size='sm'
								w='full'
								justifyContent='space-between'
							>
								{fuelTypeFilterLabel}
								<span>▾</span>
							</Button>
						</Menu.Trigger>
						<Portal>
							{/* @ts-ignore */}
							<Menu.Positioner>
								{/* @ts-ignore */}
								<Menu.Content>
									{/* @ts-ignore */}
									<Menu.Item
										value='all'
										onClick={() => setFuelTypeFilter('all')}
									>
										{t('fuelings.filters.options.all')}
									</Menu.Item>
									{availableFuelTypes.map((fuelType) => (
										/* @ts-ignore */
										<Menu.Item
											key={fuelType}
											value={fuelType}
											onClick={() => setFuelTypeFilter(fuelType)}
										>
											{getFuelTypeLabel(fuelType)}
										</Menu.Item>
									))}
								</Menu.Content>
							</Menu.Positioner>
						</Portal>
					</Menu.Root>
				</Box>

				<Button
					variant='outline'
					w={{ base: 'full', md: 'auto' }}
					onClick={() => {
						setDateFrom('');
						setDateTo('');
						setTankFilter('all');
						setFuelTypeFilter('all');
					}}
					disabled={!hasActiveFilters}
				>
					{t('fuelings.filters.clear')}
				</Button>
			</Stack>

			{filteredFuelings.length === 0 && hasActiveFilters ? (
				<Box textAlign='center' py='8' borderWidth='1px' borderRadius='md'>
					<Text fontWeight='medium' mb='1'>
						{t('fuelings.filters.emptyTitle')}
					</Text>
					<Text color='gray.500' fontSize='sm'>
						{t('fuelings.filters.emptyDescription')}
					</Text>
				</Box>
			) : (
				<>
					<Box borderWidth='1px' borderRadius='md' p='4' mb='4' bg='gray.50'>
						<Text fontSize='sm' color='gray.600' mb='3'>
							{t('fuelings.summary.title')}
						</Text>
						<SimpleGrid columns={{ base: 1, md: 3 }} gap='4'>
							<Box>
								<Text fontSize='xs' color='gray.500' mb='1'>
									{t('fuelings.summary.fuelings')}
								</Text>
								<Text fontWeight='semibold'>{visibleSummary.count}</Text>
							</Box>
							<Box>
								<Text fontSize='xs' color='gray.500' mb='1'>
									{t('fuelings.summary.totalCost')}
								</Text>
								<Text fontWeight='semibold'>
									{currencyFormatter.format(visibleSummary.totalCost)}
								</Text>
							</Box>
							<Box>
								<Text fontSize='xs' color='gray.500' mb='1'>
									{t('fuelings.summary.avgPricePerLiter')}
								</Text>
								<Text fontWeight='semibold'>
									{visibleSummary.count > 0
										? `${currencyFormatter.format(visibleSummary.avgPricePerLiter)} ${t(
												'fuelings.summary.perLiterSuffix'
											)}`
										: '-'}
								</Text>
							</Box>
						</SimpleGrid>
					</Box>

					<HStack mb='4' justify='flex-end' align='center' flexWrap='wrap'>
						<HStack gap='2'>
							<Button
								size='sm'
								variant={density === 'comfortable' ? 'solid' : 'outline'}
								colorPalette={density === 'comfortable' ? 'blue' : 'gray'}
								onClick={() => setDensity('comfortable')}
							>
								{t('fuelings.density.comfortable')}
							</Button>
							<Button
								size='sm'
								variant={density === 'compact' ? 'solid' : 'outline'}
								colorPalette={density === 'compact' ? 'blue' : 'gray'}
								onClick={() => setDensity('compact')}
							>
								{t('fuelings.density.compact')}
							</Button>
						</HStack>
					</HStack>

					<VStack gap='4' align='stretch'>
						{Object.entries(groupedFuelings).map(([month, monthFuelings]) => (
							<Box key={month}>
								<Heading
									size='sm'
									color='gray.600'
									mb={density === 'compact' ? '2' : '3'}
									pb='2'
									borderBottomWidth='1px'
								>
									{month}
								</Heading>
								<Stack gap={monthSectionGap}>
									{monthFuelings.map((fueling) => (
										<FuelingListItem
											key={fueling.id}
											fueling={fueling}
											currency={currency}
											density={density}
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
					{!hasNextPage && filteredFuelings.length > 10 && (
						<Box py='4' textAlign='center'>
							<Text color='gray.400' fontSize='sm'>
								{t('fuelings.list.endOfHistory')}
							</Text>
						</Box>
					)}
				</>
			)}
		</Box>
	);
};

export default FuelingList;
