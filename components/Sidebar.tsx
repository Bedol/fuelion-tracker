import React from 'react';
import {
	Box,
	VStack,
	Text,
	Button,
	Icon,
	HStack,
	Separator,
} from '@chakra-ui/react';
import { 
	FaHome, 
	FaCar, 
	FaGasPump, 
	FaMoneyBillWave, 
	FaChartLine, 
	FaPlus,
	FaCog 
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItemProps {
	icon: any;
	children: React.ReactNode;
	href: string;
	isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, href, isActive }) => {
	return (
		<Link href={href} style={{ textDecoration: 'none', width: '100%' }}>
			<Button
				variant={isActive ? 'solid' : 'ghost'}
				colorPalette={isActive ? 'blue' : 'gray'}
				justifyContent="flex-start"
				w="100%"
				size="sm"
				py={2}
			>
				<HStack gap={2}>
					<Icon as={icon} />
					<Text>{children}</Text>
				</HStack>
			</Button>
		</Link>
	);
};

const Sidebar: React.FC = () => {
	const router = useRouter();
	
	const navItems = [
		{ icon: FaHome, label: 'Dashboard', href: '/' },
		{ icon: FaCar, label: 'My Vehicles', href: '/vehicles' },
		{ icon: FaGasPump, label: 'Fuel Records', href: '/fueling' },
		{ icon: FaMoneyBillWave, label: 'Expenses', href: '/expenses' },
		{ icon: FaChartLine, label: 'Statistics', href: '/statistics' },
	];

	const quickActions = [
		{ icon: FaPlus, label: 'Add Vehicle', href: '/vehicles/new' },
		{ icon: FaGasPump, label: 'Add Fueling', href: '/fueling/new' },
		{ icon: FaMoneyBillWave, label: 'Add Expense', href: '/expenses/new' },
	];

	return (
		<Box
			as="aside"
			w="280px"
			h="calc(100vh - 73px)"
			bg="gray.50"
			borderRight="1px"
			borderRightColor="gray.200"
			p={4}
			overflowY="auto"
		>
			<VStack gap={4} align="stretch">
				{/* Main Navigation */}
				<Box>
					<Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} px={2}>
						NAVIGATION
					</Text>
					<VStack gap={1} align="stretch">
						{navItems.map((item) => (
							<NavItem
								key={item.href}
								icon={item.icon}
								href={item.href}
								isActive={router.pathname === item.href}
							>
								{item.label}
							</NavItem>
						))}
					</VStack>
				</Box>

				<Separator />

				{/* Quick Actions */}
				<Box>
					<Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} px={2}>
						QUICK ACTIONS
					</Text>
					<VStack gap={1} align="stretch">
						{quickActions.map((item) => (
							<NavItem
								key={item.href}
								icon={item.icon}
								href={item.href}
								isActive={router.pathname === item.href}
							>
								{item.label}
							</NavItem>
						))}
					</VStack>
				</Box>

				<Separator />

				{/* Settings */}
				<Box>
					<NavItem
						icon={FaCog}
						href="/profiles"
						isActive={router.pathname === '/profiles'}
					>
						Settings
					</NavItem>
				</Box>

				{/* Fuel Tracking Tips */}
				<Box
					bg="blue.50"
					p={3}
					borderRadius="md"
					border="1px"
					borderColor="blue.200"
					mt={4}
				>
					<Text fontSize="xs" fontWeight="bold" color="blue.800" mb={1}>
						💡 Tip
					</Text>
					<Text fontSize="xs" color="blue.700">
						Track every fill-up to get accurate fuel consumption analytics!
					</Text>
				</Box>
			</VStack>
		</Box>
	);
};

export default Sidebar;