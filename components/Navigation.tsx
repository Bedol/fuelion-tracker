import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	HStack,
	useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

const Navigation = () => {
	return (
		<Box as='section' pb='12'>
			<Box
				as='nav'
				bg='bg-surface'
				boxShadow={useColorModeValue('sm', 'sm-dark')}
			>
				<Container py='4'>
					<HStack spacing='10' justify='space-between'>
						<Flex justify='space-between' flex='1'>
							<ButtonGroup variant='link' spacing='8'>
								<Button
									as={NextLink}
									href='/'
									colorScheme='teal'
									variant='ghost'
								>
									Home
								</Button>

								<Button
									as={NextLink}
									href='/vehicles'
									colorScheme='teal'
									variant='ghost'
								>
									Your Vehicles
								</Button>
								<Button
									as={NextLink}
									href='/auth/signin'
									colorScheme='teal'
									variant='ghost'
								>
									Login
								</Button>
							</ButtonGroup>
						</Flex>
					</HStack>
				</Container>
			</Box>
		</Box>
	);
};

export default Navigation;
