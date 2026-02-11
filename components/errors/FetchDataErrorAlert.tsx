import { Center } from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';

const FetchDataErrorAlert = ({ errorMessage }) => {
	return (
		<Center>
			<Alert.Root status='error'>
				<Alert.Indicator />
				<Alert.Title>{errorMessage}</Alert.Title>
			</Alert.Root>
		</Center>
	);
};

export default FetchDataErrorAlert;
