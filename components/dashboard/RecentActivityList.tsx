import { Box, Separator, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
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
				<Text fontSize='sm' color='gray.600'>
					{t('dashboard.emptyActivityDescription')}
				</Text>
			</Box>
		);
	}

	const visibleItems = items.slice(0, 5);
	const currencyFormatter = new Intl.NumberFormat(localeCode, {
		style: 'currency',
		currency: 'PLN',
	});
	const numberFormatter = new Intl.NumberFormat(localeCode, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	});
	const distanceFormatter = new Intl.NumberFormat(localeCode);

	return (
		<Stack gap='3'>
			{visibleItems.map((item, index) => {
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
				const costLabel = currencyFormatter.format(item.cost);
				const quantityLabel = `${numberFormatter.format(item.quantity)} L`;
				const mileageLabel = `${distanceFormatter.format(item.mileage)} km`;

				return (
					<Box key={`${item.vehicleId}-${index}`}>
						<NextLink
							href={`/vehicles/${item.vehicleId}`}
							passHref
							legacyBehavior
						>
							<Box
								as='a'
								display='flex'
								alignItems='center'
								justifyContent='space-between'
								gap='4'
								fontSize='sm'
								color='gray.700'
								_hover={{ color: 'gray.900' }}
							>
								<Text
									fontWeight='medium'
									whiteSpace='nowrap'
									overflow='hidden'
									textOverflow='ellipsis'
								>
									{item.vehicleLabel}
									{registrationLabel}
								</Text>
								<Text
									flex='1'
									textAlign='right'
									color='gray.500'
									whiteSpace='nowrap'
									overflow='hidden'
									textOverflow='ellipsis'
								>
									{formattedDate} • {costLabel} • {quantityLabel} •{' '}
									{mileageLabel}
								</Text>
							</Box>
						</NextLink>
						{index < visibleItems.length - 1 && <Separator mt='3' />}
					</Box>
				);
			})}
		</Stack>
	);
};

export default RecentActivityList;
