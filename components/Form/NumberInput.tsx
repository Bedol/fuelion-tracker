import {
	NumberInputRoot,
	NumberInputInput,
	NumberInputRootProps,
	Box,
} from '@chakra-ui/react';

export interface NumberInputProps extends NumberInputRootProps {
	name: string;
	label: string;
	isRequired?: boolean;
}

export const NumberInput = (props: NumberInputProps) => {
	const { name, label, isRequired, ...rest } = props;
	return (
		<Box mb='2'>
			<Box as='label' fontWeight='medium' fontSize='sm' display='block' mb='1'>
				{label}
				{isRequired && (
					<Box as='span' color='red.500' ml='1'>
						*
					</Box>
				)}
			</Box>
			<NumberInputRoot {...rest} name={name}>
				<NumberInputInput />
			</NumberInputRoot>
		</Box>
	);
};
