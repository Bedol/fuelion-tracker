import {
	Box,
	Button,
	ButtonGroup,
	Collapsible,
	Field,
	Input,
	Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
	fuelTypes,
	powerUnits,
	transmissionTypes,
} from '../../types/vehicle_types';

type VehicleFormValues = {
	brand_name: string;
	model_name: string;
	production_year: number;
	fuel_type: string;
	registration_number?: string;
	engine_capacity?: number;
	engine_power?: number;
	power_unit?: string;
	transmission?: string;
};

type VehicleFormProps = {
	initialValues: VehicleFormValues;
	mutation: {
		mutate: (values: VehicleFormValues) => void;
		isPending: boolean;
	};
	mode: 'create' | 'edit';
};

const currentYear = new Date().getFullYear();

const VehicleForm: React.FC<VehicleFormProps> = ({
	initialValues,
	mutation,
	mode,
}) => {
	const router = useRouter();
	const [showTechnical, setShowTechnical] = useState(false);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			mutation.mutate(values);
		},
		enableReinitialize: true,
	});

	const backToVehicles = () => {
		router.push('/vehicles');
	};

	return (
		<Box maxW='600px'>
			<form onSubmit={formik.handleSubmit}>
				{/* Section 1: Basic Information */}
				<Box mb='6'>
					<Text fontSize='lg' fontWeight='semibold' mb='4'>
						Basic Information
					</Text>

					<Field.Root mb='4' required>
						<Field.Label>Brand</Field.Label>
						<Input
							type='text'
							name='brand_name'
							id='brand_name'
							onChange={formik.handleChange}
							value={formik.values.brand_name}
							placeholder='e.g., Toyota'
						/>
					</Field.Root>

					<Field.Root mb='4' required>
						<Field.Label>Model</Field.Label>
						<Input
							type='text'
							name='model_name'
							id='model_name'
							onChange={formik.handleChange}
							value={formik.values.model_name}
							placeholder='e.g., Corolla'
						/>
					</Field.Root>

					<Field.Root mb='4' required>
						<Field.Label>Production Year</Field.Label>
						<Input
							type='number'
							name='production_year'
							id='production_year'
							onChange={formik.handleChange}
							value={formik.values.production_year}
							min={1900}
							max={currentYear + 1}
						/>
					</Field.Root>

					<Field.Root mb='4' required>
						<Field.Label>Fuel Type</Field.Label>
						<Box
							as='select'
							name='fuel_type'
							id='fuel_type'
							onChange={formik.handleChange}
							value={formik.values.fuel_type}
						>
							{fuelTypes.map((option) => (
								<option key={option.value} value={option.value}>
									{option.name}
								</option>
							))}
						</Box>
					</Field.Root>

					<Field.Root mb='4'>
						<Field.Label>Registration Number (optional)</Field.Label>
						<Input
							type='text'
							name='registration_number'
							id='registration_number'
							onChange={formik.handleChange}
							value={formik.values.registration_number || ''}
							placeholder='e.g., ABC 1234'
						/>
					</Field.Root>
				</Box>

				{/* Section 2: Technical Data (Collapsible) */}
				<Box mb='6'>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setShowTechnical(!showTechnical)}
						mb={showTechnical ? '4' : '0'}
					>
						{showTechnical ? '− Hide technical data' : '+ Add technical data'}
					</Button>

					<Collapsible open={showTechnical}>
						<Box
							p='4'
							borderWidth='1px'
							borderRadius='md'
							borderColor='gray.200'
						>
							<Text fontSize='md' fontWeight='medium' mb='4'>
								Technical Specifications
							</Text>

							<Field.Root mb='4'>
								<Field.Label>Engine Capacity (cc, optional)</Field.Label>
								<Input
									type='number'
									name='engine_capacity'
									id='engine_capacity'
									onChange={formik.handleChange}
									value={formik.values.engine_capacity || ''}
									placeholder='e.g., 2000'
								/>
							</Field.Root>

							<Field.Root mb='4'>
								<Field.Label>Engine Power (optional)</Field.Label>
								<Input
									type='number'
									name='engine_power'
									id='engine_power'
									onChange={formik.handleChange}
									value={formik.values.engine_power || ''}
									placeholder='e.g., 150'
								/>
							</Field.Root>

							<Field.Root mb='4'>
								<Field.Label>Power Unit (optional)</Field.Label>
								<Box
									as='select'
									name='power_unit'
									id='power_unit'
									onChange={formik.handleChange}
									value={formik.values.power_unit || ''}
								>
									<option value=''>Select unit...</option>
									{powerUnits.map((option) => (
										<option key={option.value} value={option.value}>
											{option.name}
										</option>
									))}
								</Box>
							</Field.Root>

							<Field.Root mb='4'>
								<Field.Label>Transmission (optional)</Field.Label>
								<Box
									as='select'
									name='transmission'
									id='transmission'
									onChange={formik.handleChange}
									value={formik.values.transmission || ''}
								>
									<option value=''>Select transmission...</option>
									{transmissionTypes.map((option) => (
										<option key={option.value} value={option.value}>
											{option.name}
										</option>
									))}
								</Box>
							</Field.Root>
						</Box>
					</Collapsible>
				</Box>

				{/* Submit Buttons */}
				<ButtonGroup mt='4' variant='outline'>
					<Button
						loading={mutation.isPending}
						loadingText='Submitting'
						type='submit'
						colorPalette='blue'
					>
						{mode === 'create' ? 'Create Vehicle' : 'Save Changes'}
					</Button>
					<Button onClick={backToVehicles}>Cancel</Button>
				</ButtonGroup>
			</form>
		</Box>
	);
};

export default VehicleForm;
