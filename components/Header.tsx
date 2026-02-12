import React from 'react';
import {
	Box,
	Flex,
	Heading,
	Spacer,
	Button,
	Text,
	HStack,
} from '@chakra-ui/react';
import { FaGasPump } from 'react-icons/fa';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Header: React.FC = () => {
	const { data: session } = useSession();

	return (
		<Box
			as='header'
			bg='white'
			borderBottom='1px'
			borderBottomColor='gray.200'
			px={6}
			py={4}
			shadow='sm'
		>
			<Flex alignItems='center'>
				{/* Logo and App Name */}
				<Link href='/' style={{ textDecoration: 'none' }}>
					<HStack gap={2} cursor='pointer'>
						<Box color='blue.500'>
							<FaGasPump size={24} />
						</Box>
						<Heading size='md' color='blue.600'>
							Fuelion Tracker
						</Heading>
					</HStack>
				</Link>

				<Spacer />

				{/* Right side actions */}
				<HStack gap={4}>
					{/* User info and actions */}
					{session ? (
						<HStack gap={4}>
							<Text fontSize='sm' fontWeight='medium'>
								Welcome, {session.user?.name || 'User'}!
							</Text>
							<Button
								colorPalette='red'
								variant='outline'
								size='sm'
								onClick={() => signOut()}
							>
								Sign Out
							</Button>
						</HStack>
					) : (
						<Button
							colorPalette='blue'
							variant='solid'
							size='sm'
							onClick={() => signIn()}
						>
							Sign In
						</Button>
					)}
				</HStack>
			</Flex>
		</Box>
	);
};

export default Header;
