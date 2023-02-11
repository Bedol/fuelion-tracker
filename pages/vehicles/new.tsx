import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Text,
} from '@chakra-ui/react';
import { Vehicles } from '@prisma/client';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';

const NewVehicle = () => {
	const vehicleMutation = useMutation(
		(values: Omit<Vehicles, 'id' | 'created_at' | 'updated_at'>) =>
			fetch('/api/vehicles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})
	);

	const formik = useFormik({
		initialValues: {
			brand: '',
			model: '',
			fuel_type: '',
			gearbox: '',
			power: 0,
			power_unit: '',
			type: '',
			production_year: 1900,
			engine_capacity: 0.0,
			mileage: 0,
		},
		onSubmit: async (values, actions) => {
			await vehicleMutation.mutate(values);
			actions.setSubmitting(false);
			actions.resetForm();
		},
	});

	return (
		<Box>
			<Text fontSize='2xl' mb='2'>
				Add New Vehicle
			</Text>
			<Flex flexDir='column' justifyContent='space-between'>
				<form onSubmit={formik.handleSubmit}>
					<FormControl>
						<FormLabel htmlFor='brand'>Brand</FormLabel>
						<Input
							type='text'
							name='brand'
							id='brand'
							onChange={formik.handleChange}
							value={formik.values.brand}
						/>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor='model'>Model</FormLabel>
						<Input
							type='text'
							name='model'
							id='model'
							onChange={formik.handleChange}
							value={formik.values.model}
						/>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor='production_year'>Production Year</FormLabel>
						<Input
							type='number'
							name='production_year'
							id='production_year'
							onChange={formik.handleChange}
							value={formik.values.production_year}
						/>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor='engine_capacity'>Engine Capacity</FormLabel>
						<Input
							type='number'
							name='engine_capacity'
							id='engine_capacity'
							onChange={formik.handleChange}
							value={formik.values.engine_capacity}
						/>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor='mileage'>Mileage</FormLabel>
						<Input
							type='number'
							name='mileage'
							id='mileage'
							onChange={formik.handleChange}
							value={formik.values.mileage}
						/>
					</FormControl>

					<Button
						type='submit'
						colorScheme='telegram'
						variant='outline'
						my='4'
						disabled={formik.isSubmitting}
					>
						{formik.isSubmitting ? 'Submitting...' : 'Submit'}
					</Button>
				</form>
			</Flex>
		</Box>
	);
};

export default NewVehicle;
