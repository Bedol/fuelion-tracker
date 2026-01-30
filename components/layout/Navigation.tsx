import React from 'react';
import { Box, Flex, Heading, Button, HStack } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { Menu } from '@chakra-ui/react';
import { FaCar, FaChartBar } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useLocale } from '../../contexts/LocaleContext';
import Link from 'next/link';

const Navigation: React.FC = () => {
	const { data: session } = useSession();
	const { locale, setLocale, t } = useLocale();
	const router = useRouter();

	const isActive = (path: string) => router.pathname === path;

	const toggleLocale = () => {
		setLocale(locale === 'pl' ? 'en' : 'pl');
	};

	return (
		<>
			{/* Desktop Navigation - Top Bar */}
			<Box
				position='sticky'
				top='0'
				width='full'
				bg='white'
				shadow='sm'
				zIndex='sticky'
				display={{ base: 'none', md: 'block' }}
			>
				<Flex
					maxW='1200px'
					mx='auto'
					px='6'
					py='4'
					justify='space-between'
					align='center'
				>
					{/* Left side: Logo + Nav Links */}
					<HStack gap='6'>
						<Heading size='md' color='blue.600'>
							Fuelion
						</Heading>

						<HStack gap='2'>
							<Button
								as={Link}
								href='/vehicles'
								variant={isActive('/vehicles') ? 'solid' : 'ghost'}
								colorScheme={isActive('/vehicles') ? 'blue' : 'gray'}
								size='sm'
							>
								<FaCar />
								{t('nav.vehicles')}
							</Button>

							<Button
								as={Link}
								href='/statistics'
								variant={isActive('/statistics') ? 'solid' : 'ghost'}
								colorScheme={isActive('/statistics') ? 'blue' : 'gray'}
								size='sm'
							>
								<FaChartBar />
								{t('nav.statistics')}
							</Button>
						</HStack>
					</HStack>

					{/* Right side: Language Toggle + User Menu */}
					<HStack gap='3'>
						{/* Language Toggle */}
						<Button size='sm' variant='ghost' onClick={toggleLocale}>
							{locale.toUpperCase()}
						</Button>

						{/* User Avatar Menu */}
						{session && (
							<Menu.Root>
								<Menu.Trigger asChild>
									<Button variant='ghost' size='sm' p='0' minW='auto'>
										<Avatar.Root size='sm'>
											<Avatar.Image
												src={session.user?.image || undefined}
												alt={session.user?.name || 'User'}
											/>
											<Avatar.Fallback>
												{(session.user?.name || 'U').charAt(0).toUpperCase()}
											</Avatar.Fallback>
										</Avatar.Root>
									</Button>
								</Menu.Trigger>
								<Menu.Content>
									<Menu.Item
										value='signout'
										onClick={() => signOut({ callbackUrl: '/auth/signin' })}
									>
										{t('nav.signOut')}
									</Menu.Item>
								</Menu.Content>
							</Menu.Root>
						)}
					</HStack>
				</Flex>
			</Box>

			{/* Mobile Navigation - Bottom Bar */}
			<Box
				position='fixed'
				bottom='0'
				width='full'
				bg='white'
				shadow='md'
				zIndex='sticky'
				display={{ base: 'block', md: 'none' }}
			>
				<Flex justify='space-around' py='3'>
					{/* Vehicles Button */}
					<Button
						as={Link}
						href='/vehicles'
						variant={isActive('/vehicles') ? 'solid' : 'ghost'}
						colorScheme={isActive('/vehicles') ? 'blue' : 'gray'}
						flexDirection='column'
						height='auto'
						py='2'
					>
						<FaCar size={20} />
						<Box fontSize='xs' mt='1'>
							{t('nav.vehicles')}
						</Box>
					</Button>

					{/* Statistics Button */}
					<Button
						as={Link}
						href='/statistics'
						variant={isActive('/statistics') ? 'solid' : 'ghost'}
						colorScheme={isActive('/statistics') ? 'blue' : 'gray'}
						flexDirection='column'
						height='auto'
						py='2'
					>
						<FaChartBar size={20} />
						<Box fontSize='xs' mt='1'>
							{t('nav.statistics')}
						</Box>
					</Button>
				</Flex>
			</Box>
		</>
	);
};

export default Navigation;
