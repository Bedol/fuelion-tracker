import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	HStack,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';

const Navigation = () => {
	const { status } = useSession();

	return (
		<Box as='section' pb='12'>
			<Box as='nav' bg='bg-surface' boxShadow='sm'>
				<Container py='4'>
					<HStack gap='10' justify='space-between'>
						<Flex justify='space-between' flex='1'>
							<ButtonGroup  gap='8'>
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
								{status === 'unauthenticated' ? (
									<Button
										as={NextLink}
										href='/auth/signin'
										colorScheme='teal'
										variant='ghost'
									>
										Login
									</Button>
								) : (
									<Button
										variant='solid'
										colorScheme='red'
										onClick={() => signOut()}
									>
										Sign Out
									</Button>
								)}
							</ButtonGroup>
						</Flex>
					</HStack>
				</Container>
			</Box>
		</Box>
	);
};

export default Navigation;
