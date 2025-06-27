import React from 'react';
import {
	Box,
	Heading,
	Text,
	Grid,
	GridItem,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Button,
	VStack,
	HStack,
	Icon,
} from '@chakra-ui/react';
import {
	FaCar,
	FaGasPump,
	FaMoneyBillWave,
	FaChartLine,
	FaPlus,
} from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const StatCard = ({ title, value, helpText, icon, color = 'blue' }) => (
	<Box
		p={6}
		bg="white"
		borderRadius="lg"
		border="1px"
		borderColor="gray.200"
		shadow="sm"
	>
		<HStack justify="space-between" mb={4}>
			<Box>
				<Text fontSize="sm" color="gray.600" mb={1}>
					{title}
				</Text>
				<Text fontSize="2xl" fontWeight="bold">
					{value}
				</Text>
				{helpText && (
					<Text fontSize="sm" color="gray.500">
						{helpText}
					</Text>
				)}
			</Box>
			<Box color={`${color}.500`}>
				<Icon as={icon} boxSize={8} />
			</Box>
		</HStack>
	</Box>
);

const QuickActionCard = ({ title, description, href, icon, color = 'blue' }) => (
	<Link href={href} style={{ textDecoration: 'none' }}>
		<Box
			p={6}
			bg="white"
			borderRadius="lg"
			border="1px"
			borderColor="gray.200"
			shadow="sm"
			cursor="pointer"
			transition="all 0.2s"
			_hover={{
				shadow: 'md',
				borderColor: `${color}.300`,
				transform: 'translateY(-2px)',
			}}
		>
			<VStack spacing={4} align="center">
				<Box color={`${color}.500`}>
					<Icon as={icon} boxSize={12} />
				</Box>
				<Box textAlign="center">
					<Text fontWeight="bold" mb={2}>
						{title}
					</Text>
					<Text fontSize="sm" color="gray.600">
						{description}
					</Text>
				</Box>
			</VStack>
		</Box>
	</Link>
);

const HomePage = () => {
	const { data: session } = useSession();

	if (!session) {
		return (
			<Box textAlign="center" py={20}>
				<VStack spacing={6}>
					<Icon as={FaGasPump} boxSize={16} color="blue.500" />
					<Heading size="lg">Welcome to Fuelion Tracker</Heading>
					<Text color="gray.600" maxW="md">
						Track your vehicle's fuel consumption, maintenance costs, and get
						insights into your driving patterns. Please sign in to get started.
					</Text>
					<Button colorScheme="blue" size="lg">
						Get Started
					</Button>
				</VStack>
			</Box>
		);
	}

	return (
		<Box>
			{/* Welcome Section */}
			<Box mb={8}>
				<Heading size="lg" mb={2}>
					Welcome back, {session.user?.name}! 👋
				</Heading>
				<Text color="gray.600">
					Here's your fuel tracking overview and quick actions.
				</Text>
			</Box>

			{/* Stats Grid */}
			<Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
				<StatCard
					title="Total Vehicles"
					value="3"
					helpText="Active vehicles"
					icon={FaCar}
					color="blue"
				/>
				<StatCard
					title="This Month's Fuel"
					value="€245.80"
					helpText="12 fill-ups"
					icon={FaGasPump}
					color="green"
				/>
				<StatCard
					title="Average Consumption"
					value="7.2 L/100km"
					helpText="Last 30 days"
					icon={FaChartLine}
					color="orange"
				/>
				<StatCard
					title="Total Expenses"
					value="€1,240.50"
					helpText="This year"
					icon={FaMoneyBillWave}
					color="red"
				/>
			</Grid>

			{/* Quick Actions */}
			<Box mb={8}>
				<Heading size="md" mb={4}>
					Quick Actions
				</Heading>
				<Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
					<QuickActionCard
						title="Add Vehicle"
						description="Register a new vehicle to start tracking"
						href="/vehicles/new"
						icon={FaCar}
						color="blue"
					/>
					<QuickActionCard
						title="Record Fueling"
						description="Log your latest fuel purchase"
						href="/vehicles"
						icon={FaGasPump}
						color="green"
					/>
					<QuickActionCard
						title="Add Expense"
						description="Track maintenance and other costs"
						href="/expenses/new"
						icon={FaMoneyBillWave}
						color="orange"
					/>
				</Grid>
			</Box>

			{/* Recent Activity Placeholder */}
			<Box>
				<Heading size="md" mb={4}>
					Recent Activity
				</Heading>
				<Box
					p={8}
					bg="gray.50"
					borderRadius="lg"
					border="2px dashed"
					borderColor="gray.300"
					textAlign="center"
				>
					<Icon as={FaChartLine} boxSize={12} color="gray.400" mb={4} />
					<Text color="gray.500" mb={2}>
						No recent activity yet
					</Text>
					<Text fontSize="sm" color="gray.400">
						Start by adding a vehicle and recording your first fuel purchase
					</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default HomePage;