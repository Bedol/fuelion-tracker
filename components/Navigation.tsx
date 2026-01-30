import { Box, Button, Container, Flex } from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';

const Navigation = () => {
	const { status } = useSession();

	return (
		<Box as='section' pb='12'>
			<Box as='nav' bg='bg-surface' boxShadow='sm'>
				<Container py='4'>
					<Flex gap='10' justify='space-between' align='center'>
						<Flex gap='8' flex='1'>
							<NextLink href='/' passHref legacyBehavior>
								<Button as='a' colorScheme='teal' variant='ghost'>
									Home
								</Button>
							</NextLink>

							<NextLink href='/vehicles' passHref legacyBehavior>
								<Button as='a' colorScheme='teal' variant='ghost'>
									Your Vehicles
								</Button>
							</NextLink>

							{status === 'unauthenticated' ? (
								<NextLink href='/auth/signin' passHref legacyBehavior>
									<Button as='a' colorScheme='teal' variant='ghost'>
										Login
									</Button>
								</NextLink>
							) : (
								<Button variant='solid' colorScheme='red' onClick={() => signOut()}>
									Sign Out
								</Button>
							)}
						</Flex>
					</Flex>
				</Container>
			</Box>
		</Box>
	);
};

export default Navigation;
