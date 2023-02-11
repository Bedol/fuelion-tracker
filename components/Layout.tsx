import { Box, Flex } from '@chakra-ui/react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
	return (
		<Flex flexDirection='column' flex='1'>
			<Navigation />
			<Flex as='main' role='main' direction='column' flex='1' py='sm'>
				<Box flex='1' px='12'>
					{children}
				</Box>
			</Flex>
		</Flex>
	);
};

export default Layout;
