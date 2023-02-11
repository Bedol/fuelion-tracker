import { Box } from '@chakra-ui/react';

const Card = ({ children }) => {
	return (
		<Box
			bg='white'
			border='1px solid'
			borderColor='gray.200'
			borderRadius='md'
			boxShadow='sm'
			p='6'
		>
			{children}
		</Box>
	);
};

export default Card;
