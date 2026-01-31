import { Box, Heading, Text, Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useLocale } from '../../contexts/LocaleContext';

const StatisticsPage = () => {
	const router = useRouter();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth/signin');
		},
	});
	const { t } = useLocale();

	if (status === 'loading') {
		return <SkeletonLoader type='page' />;
	}

	return (
		<Box
			minH='calc(100vh - 120px)'
			display='flex'
			alignItems='center'
			justifyContent='center'
		>
			<Stack gap='6' align='center' textAlign='center' maxW='2xl' px='6'>
				<Heading size='2xl' color='blue.600'>
					{t('nav.statistics')}
				</Heading>
				<Text fontSize='lg' color='gray.600'>
					Global statistics dashboard coming in Phase 4. For now, statistics
					will be vehicle-specific in Phase 3-4.
				</Text>
			</Stack>
		</Box>
	);
};

export default StatisticsPage;
