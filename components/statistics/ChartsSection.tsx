import { Card, Heading } from '@chakra-ui/react';

const ChartsSection = () => {
	return (
		// @ts-ignore - Chakra v3 Card compound component types
		<Card.Root mb='3'>
			{/* @ts-ignore */}
			<Card.Body width={{ base: '200px', lg: '900px', md: '640px' }}>
				<Heading size='md'>Charts</Heading>
			</Card.Body>
		</Card.Root>
	);
};

export default ChartsSection;
