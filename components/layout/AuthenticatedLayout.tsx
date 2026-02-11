import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Navigation from './Navigation';

type AuthenticatedLayoutProps = {
	children: ReactNode;
};

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
	children,
}) => {
	return (
		<Box minH='100vh' bg='gray.50'>
			{/* Navigation - renders sticky desktop bar or fixed mobile bottom bar */}
			<Navigation />

			{/* Content Area */}
			<Box
				flex='1'
				p='6'
				pb={{ base: '20', md: '6' }} // Extra bottom padding on mobile for bottom nav
			>
				<Box maxW='1200px' mx='auto'>
					{children}
				</Box>
			</Box>
		</Box>
	);
};

export default AuthenticatedLayout;
