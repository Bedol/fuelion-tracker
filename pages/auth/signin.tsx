import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaGasPump } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useLocale } from '../../contexts/LocaleContext';

export default function SignIn() {
	const router = useRouter();
	const { data: session } = useSession();
	const { t } = useLocale();

	useEffect(() => {
		if (session) {
			router.push('/');
		}
	}, [session, router]);

	return (
		<Box
			minH='100vh'
			display='flex'
			alignItems='center'
			justifyContent='center'
			bg='gray.50'
		>
			<Stack gap='6' align='center' maxW='md' px='6'>
				<Box color='blue.500'>
					<FaGasPump size={64} />
				</Box>
				<Heading size='2xl' color='blue.600'>
					Fuelion
				</Heading>
				<Button
					onClick={() => signIn('google', { callbackUrl: '/' })}
					colorScheme='blue'
					size='lg'
					width='full'
					maxW='sm'
				>
					<Box mr='3'>
						<FcGoogle size={24} />
					</Box>
					{t('auth.signInWithGoogle')}
				</Button>
			</Stack>
		</Box>
	);
}
