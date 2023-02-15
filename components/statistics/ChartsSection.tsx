import { Card, CardBody, Heading } from '@chakra-ui/react';

const ChartsSection = () => {
	return (
		<Card mb='3'>
			<CardBody width={{ base: '200px', lg: '900px', md: '640px' }}>
				<Heading size='md'>Charts</Heading>
			</CardBody>
		</Card>
	);
};

export default ChartsSection;
