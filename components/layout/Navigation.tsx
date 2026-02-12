import React from 'react';
import { Box, Flex, Heading, Button, HStack } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { Menu } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { useLocale } from '../../contexts/LocaleContext';
import Link from 'next/link';

const Navigation: React.FC = () => {
	const { data: session } = useSession();
	const { locale, setLocale, t } = useLocale();

	const toggleLocale = () => {
		setLocale(locale === 'pl' ? 'en' : 'pl');
	};

	return (
		<Box
			position='sticky'
			top='0'
			width='full'
			bg='white'
			shadow='sm'
			zIndex='sticky'
		>
			<Flex
				maxW='1200px'
				mx='auto'
				px={{ base: '4', md: '6' }}
				py='4'
				justify='space-between'
				align='center'
			>
				{/* Left side: Logo */}
				<HStack>
					<Link href='/'>
						<Heading size='md' color='blue.600' cursor='pointer'>
							Fuelion
						</Heading>
					</Link>
				</HStack>

				{/* Right side: Language Toggle + User Menu */}
				<HStack gap='3'>
					{/* Language Toggle */}
					<Button size='sm' variant='ghost' onClick={toggleLocale}>
						{locale.toUpperCase()}
					</Button>

					{/* User Avatar Menu */}
					{session && (
						// @ts-ignore - Chakra v3 Menu/Avatar compound component types
						<Menu.Root>
							{/* @ts-ignore */}
							<Menu.Trigger asChild>
								<Button variant='ghost' size='sm' p='0' minW='auto'>
									{/* @ts-ignore */}
									<Avatar.Root size='sm'>
										{/* @ts-ignore */}
										<Avatar.Image src={session.user?.image || ''} />
										{/* @ts-ignore */}
										<Avatar.Fallback>
											{(session.user?.name || 'U').charAt(0).toUpperCase()}
										</Avatar.Fallback>
									</Avatar.Root>
								</Button>
							</Menu.Trigger>
							{/* @ts-ignore */}
							<Menu.Content>
								{/* @ts-ignore */}
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
	);
};

export default Navigation;
