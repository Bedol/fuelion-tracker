import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';

type LayoutProps = {
	children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<Box minH="100vh" bg="gray.50">
			{/* Header */}
			<Header />
			
			{/* Main Layout Container */}
			<Flex>
				{/* Sidebar */}
				<Sidebar />
				
				{/* Main Content Area */}
				<Box
					flex="1"
					p={6}
					bg="white"
					minH="calc(100vh - 73px)"
					overflowY="auto"
				>
					<Box maxW="1200px" mx="auto">
						{children}
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default Layout;