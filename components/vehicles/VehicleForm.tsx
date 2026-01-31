import {
	Box,
	Button,
	ButtonGroup,
	Collapsible,
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

					<Box mb='4'>
						<Text
							as='label'
							htmlFor='brand_name'
							fontSize='sm'
							fontWeight='medium'
							mb='2'
							display='block'
						>
							Brand *
						</Text>
						<Input
							type='text'
							name='brand_name'
							id='brand_name'
							onChange={formik.handleChange}
							value={formik.values.brand_name}
							placeholder='e.g., Toyota'
							required
						/>
					</Box>

					<Box mb='4'>
						<Text
							as='label'
							htmlFor='model_name'
							fontSize='sm'
							fontWeight='medium'
							mb='2'
							display='block'
						>
							Model *
						</Text>
						<Input
							type='text'
							name='model_name'
							id='model_name'
							onChange={formik.handleChange}
							value={formik.values.model_name}
							placeholder='e.g., Corolla'
							required
						/>
					</Box>

					<Box mb='4'>
						<Text
							as='label'
							htmlFor='production_year'
							fontSize='sm'
							fontWeight='medium'
							mb='2'
							display='block'
						>
							Production Year *
						</Text>
						<Input
							type='number'
							name='production_year'
							id='production_year'
							onChange={formik.handleChange}
							value={formik.values.production_year}
							min={1900}
							max={currentYear + 1}
							required
						/>
					</Box>

					<Box mb='4'>
						<Text
							as='label'
							htmlFor='fuel_type'
							fontSize='sm'
							fontWeight='medium'
							mb='2'
							display='block'
						>
							Fuel Type *
						</Text>
						<Box
							as='select'
							name='fuel_type'
							id='fuel_type'
							onChange={formik.handleChange}
							value={formik.values.fuel_type}
							required
							className='chakra-select'
							p='2'
							borderWidth='1px'
							borderRadius='md'
							w='full'
						>
							{fuelTypes.map((option) => (
								<option key={option.value} value={option.value}>
									{option.name}
								</option>
							))}
						</Box>
					</Box>

					<Box mb='4'>
						<Text
							as='label'
							htmlFor='registration_number'
							fontSize='sm'
							fontWeight='medium'
							mb='2'
							display='block'
						>
							Registration Number (optional)
						</Text>
						<Input
							type='text'
							name='registration_number'
							id='registration_number'
							onChange={formik.handleChange}
							value={formik.values.registration_number || ''}
							placeholder='e.g., ABC 1234'
						/>
					</Box>
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

					<Collapsible.Root open={showTechnical}>
						<Collapsible.Content>
							<Box
								p='4'
								borderWidth='1px'
								borderRadius='md'
								borderColor='gray.200'
							>
								<Text fontSize='md' fontWeight='medium' mb='4'>
									Technical Specifications
								</Text>

								<Box mb='4'>
									<Text
										as='label'
										htmlFor='engine_capacity'
										fontSize='sm'
										fontWeight='medium'
										mb='2'
										display='block'
									>
										Engine Capacity (cc, optional)
									</Text>
									<Input
										type='number'
										name='engine_capacity'
										id='engine_capacity'
										onChange={formik.handleChange}
										value={formik.values.engine_capacity || ''}
										placeholder='e.g., 2000'
									/>
								</Box>

								<Box mb='4'>
									<Text
										as='label'
										htmlFor='engine_power'
										fontSize='sm'
										fontWeight='medium'
										mb='2'
										display='block'
									>
										Engine Power (optional)
									</Text>
									<Input
										type='number'
										name='engine_power'
										id='engine_power'
										onChange={formik.handleChange}
										value={formik.values.engine_power || ''}
										placeholder='e.g., 150'
									/>
								</Box>

								<Box mb='4'>
									<Text
										as='label'
										htmlFor='power_unit'
										fontSize='sm'
										fontWeight='medium'
										mb='2'
										display='block'
									>
										Power Unit (optional)
									</Text>
									<Box
										as='select'
										name='power_unit'
										id='power_unit'
										onChange={formik.handleChange}
										value={formik.values.power_unit || ''}
										className='chakra-select'
										p='2'
										borderWidth='1px'
										borderRadius='md'
										w='full'
									>
										<option value=''>Select unit...</option>
										{powerUnits.map((option) => (
											<option key={option.value} value={option.value}>
												{option.name}
											</option>
										))}
									</Box>
								</Box>

								<Box mb='4'>
									<Text
										as='label'
										htmlFor='transmission'
										fontSize='sm'
										fontWeight='medium'
										mb='2'
										display='block'
									>
										Transmission (optional)
									</Text>
									<Box
										as='select'
										name='transmission'
										id='transmission'
										onChange={formik.handleChange}
										value={formik.values.transmission || ''}
										className='chakra-select'
										p='2'
										borderWidth='1px'
										borderRadius='md'
										w='full'
									>
										<option value=''>Select transmission...</option>
										{transmissionTypes.map((option) => (
											<option key={option.value} value={option.value}>
												{option.name}
											</option>
										))}
									</Box>
								</Box>
							</Box>
						</Collapsible.Content>
					</Collapsible.Root>
				</Box>

				{/* Submit Buttons */}
				<ButtonGroup mt='4' gap='3'>
					<Button
						loading={mutation.isPending}
						loadingText='Submitting'
						type='submit'
						colorPalette='blue'
					>
						{mode === 'create' ? 'Create Vehicle' : 'Save Changes'}
					</Button>
					<Button variant='outline' onClick={backToVehicles}>
						Cancel
					</Button>
				</ButtonGroup>
			</form>
		</Box>
	);
};

export default VehicleForm;
