import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

const VehicleForm = ({ initialValues, mutation }) => {
	const router = useRouter();
	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: async (values) => {
			await mutation.mutate(values);
		},
	});
	const backToVehicles = () => {
		router.push('/vehicles');
	};

	return (
		<Flex flexDir='column' justifyContent='space-between'>
			<form onSubmit={formik.handleSubmit}>
				<FormControl mb='4'>
					<FormLabel htmlFor='brand'>Brand</FormLabel>
					<Input
						type='text'
						name='brand'
						id='brand'
						onChange={formik.handleChange}
						value={formik.values.brand}
					/>
				</FormControl>
				<FormControl mb='4'>
					<FormLabel htmlFor='model'>Model</FormLabel>
					<Input
						type='text'
						name='model'
						id='model'
						onChange={formik.handleChange}
						value={formik.values.model}
					/>
				</FormControl>
				<FormControl mb='4'>
					<FormLabel htmlFor='production_year'>Production Year</FormLabel>
					<Input
						type='number'
						name='production_year'
						id='production_year'
						onChange={formik.handleChange}
						value={formik.values.production_year}
					/>
				</FormControl>
				<ButtonGroup mt='4' variant='outline'>
					<Button
						isLoading={mutation.isLoading}
						loadingText='Submitting'
						type='submit'
						colorScheme='blue'
					>
						Submit
					</Button>
					<Button onClick={backToVehicles}>Cancel</Button>
				</ButtonGroup>
			</form>
		</Flex>
	);
};

export default VehicleForm;
