import { Box, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useMemo } from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import type { DashboardActivityItem } from '../../types/dashboard_types';

type RecentActivityListProps = {
	items: DashboardActivityItem[];
};

const RecentActivityList: React.FC<RecentActivityListProps> = ({ items }) => {
	const { locale, t } = useLocale();
	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';

	if (items.length === 0) {
		return (
			<Box borderWidth='1px' borderRadius='lg' p='4' bg='gray.50'>
				<Text color='gray.600'>{t('dashboard.emptyActivityDescription')}</Text>
			</Box>
		);
	}

	const visibleItems = items.slice(0, 5);
	const numberFormatter = new Intl.NumberFormat(localeCode, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	const distanceFormatter = new Intl.NumberFormat(localeCode);

	const groupedItems = useMemo(() => {
		const groups: Record<string, DashboardActivityItem[]> = {};

		visibleItems.forEach((item) => {
			const monthKey = item.date
				? new Date(item.date).toLocaleDateString(localeCode, {
						year: 'numeric',
						month: 'long',
					})
				: '--';

			if (!groups[monthKey]) {
				groups[monthKey] = [];
			}

			groups[monthKey].push(item);
		});

		return Object.entries(groups);
	}, [localeCode, visibleItems]);

	const formatCurrency = (value: number, currency: string) => {
		return new Intl.NumberFormat(localeCode, {
			style: 'currency',
			currency,
		}).format(value);
	};

	return (
		<VStack gap='4' align='stretch'>
			{groupedItems.map(([month, monthItems]) => (
				<Box key={month}>
					<Heading
						size='sm'
						color='gray.600'
						mb='2'
						pb='2'
						borderBottomWidth='1px'
					>
						{month}
					</Heading>
					<Stack gap='2'>
						{monthItems.map((item, index) => {
							const formattedDate = item.date
								? new Date(item.date).toLocaleDateString(localeCode, {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})
								: '--';
							const registrationLabel = item.registrationNumber
								? ` (${item.registrationNumber})`
								: '';
							const unitCost =
								item.quantity > 0 ? item.cost / item.quantity : 0;

							return (
								<NextLink
									key={`${item.vehicleId}-${item.date ?? index}-${index}`}
									href={`/vehicles/${item.vehicleId}`}
									passHref
									legacyBehavior
								>
									<Box
										as='a'
										p='2'
										borderWidth='1px'
										borderRadius='lg'
										borderColor='gray.200'
										bg='white'
										_hover={{ shadow: 'xs' }}
										transition='all 0.2s'
									>
										<Stack
											direction={{ base: 'column', md: 'row' }}
											justify='space-between'
											align={{ base: 'flex-start', md: 'center' }}
											gap='2'
										>
											<Box flex='1' minW='0'>
												<HStack gap='2' wrap='wrap' mb='0.5'>
													<Text fontWeight='semibold' fontSize='sm'>
														{formattedDate}
													</Text>
													<Text
														fontSize='sm'
														color='gray.500'
														whiteSpace='nowrap'
														overflow='hidden'
														textOverflow='ellipsis'
													>
														{item.vehicleLabel}
														{registrationLabel}
													</Text>
												</HStack>
												<Text fontSize='sm' color='gray.500'>
													{numberFormatter.format(item.quantity)} L @{' '}
													{numberFormatter.format(unitCost)} {item.currency}/L •{' '}
													{t('fuelings.item.odometer')}:{' '}
													{distanceFormatter.format(item.mileage)} km
												</Text>
											</Box>
											<Text fontSize='md' fontWeight='bold' color='blue.600'>
												{formatCurrency(item.cost, item.currency)}
											</Text>
										</Stack>
									</Box>
								</NextLink>
							);
						})}
					</Stack>
				</Box>
			))}
		</VStack>
	);
};

export default RecentActivityList;
