import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
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
		return (
			<Box maxW='1200px' mx='auto' p='4'>
				<Box mb='6'>
					<Link href='/'>
						<Button variant='outline'>
							<FaHome />
							{t('statistics.goToDashboard')}
						</Button>
					</Link>
				</Box>
				<SkeletonLoader type='page' />
			</Box>
		);
	}

	return (
		<Box maxW='1200px' mx='auto' p='4'>
			<Box mb='6'>
				<Link href='/'>
					<Button variant='outline'>
						<FaHome />
						{t('statistics.goToDashboard')}
					</Button>
				</Link>
			</Box>
			<Box
				minH='calc(100vh - 220px)'
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
		</Box>
	);
};

export default StatisticsPage;
