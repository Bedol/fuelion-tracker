import React from 'react';
import { Box, Input } from '@chakra-ui/react';

type SliderThumbWithTooltipProps = {
	defaultValue: number;
	name: string;
};

// Temporary: Using native HTML range input until Chakra v3 Slider API is clarified
export const SliderThumbWithTooltip: React.FC<SliderThumbWithTooltipProps> = ({
	defaultValue,
	name,
}) => {
	const [value, setValue] = React.useState(defaultValue);
	return (
		<Box mb='4'>
			<Box display='flex' justifyContent='space-between' mb='2' fontSize='sm'>
				<Box>0%</Box>
				<Box fontWeight='bold' color='teal.600'>
					{value}%
				</Box>
				<Box>100%</Box>
			</Box>
			<Input
				type="range"
				name={name}
				value={value}
				onChange={(e) => setValue(Number(e.target.value))}
				min={0}
				max={100}
				width="100%"
			/>
		</Box>
	);
};
