import { Alert, Box, Button } from '@chakra-ui/react';
import { Collapsible } from '@chakra-ui/react';
import { useState } from 'react';
import { useLocale } from '../../contexts/LocaleContext';

type ErrorAlertProps = {
	error: Error | { message: string };
	title?: string;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, title }) => {
	const [showDetails, setShowDetails] = useState(false);
	const { t } = useLocale();

	const errorStack = 'stack' in error ? error.stack : undefined;

	return (
		<Alert.Root status='error'>
			<Alert.Indicator />
			<Box flex='1'>
				<Alert.Title>{title || t('errors.generic')}</Alert.Title>
				<Alert.Description>
					{error.message || t('errors.tryAgain')}
				</Alert.Description>
				{errorStack && (
					<>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => setShowDetails(!showDetails)}
							mt='2'
						>
							{showDetails ? t('errors.hideDetails') : t('errors.showDetails')}
						</Button>
						{/* @ts-ignore - Chakra v3 Collapsible compound types */}
						<Collapsible.Root open={showDetails}>
							{/* @ts-ignore */}
							<Collapsible.Content>
								<Box
									as='pre'
									fontSize='xs'
									p='2'
									bg='gray.100'
									borderRadius='md'
									overflow='auto'
									mt='2'
								>
									{errorStack}
								</Box>
							</Collapsible.Content>
						</Collapsible.Root>
					</>
				)}
			</Box>
		</Alert.Root>
	);
};

export default ErrorAlert;
