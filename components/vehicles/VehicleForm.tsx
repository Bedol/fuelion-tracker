import {
	Box,
	Button,
	ButtonGroup,
	Collapsible,
	Input,
	NativeSelect,
	Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useLocale } from '../../contexts/LocaleContext';
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
	const { t } = useLocale();
	const [showTechnical, setShowTechnical] = useState(false);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			mutation.mutate(values);
		},
		enableReinitialize: true,
	});

	const backToVehicles = () => {
		const routeVehicleId = router.query.id;
		if (mode === 'edit' && typeof routeVehicleId === 'string') {
			router.push(`/vehicles/${routeVehicleId}`);
			return;
		}

		router.push('/vehicles');
	};

	return (
		<Box maxW='600px'>
			<form onSubmit={formik.handleSubmit}>
				{/* Section 1: Basic Information */}
				<Box mb='6'>
					<Text fontSize='lg' fontWeight='semibold' mb='4'>
						{t('vehicles.form.sections.basicInformation')}
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
							{t('vehicles.form.fields.brand')} *
						</Text>
						<Input
							type='text'
							name='brand_name'
							id='brand_name'
							onChange={formik.handleChange}
							value={formik.values.brand_name}
							placeholder={t('vehicles.form.placeholders.brandExample')}
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
							{t('vehicles.form.fields.model')} *
						</Text>
						<Input
							type='text'
							name='model_name'
							id='model_name'
							onChange={formik.handleChange}
							value={formik.values.model_name}
							placeholder={t('vehicles.form.placeholders.modelExample')}
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
							{t('vehicles.form.fields.productionYear')} *
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
							{t('vehicles.form.fields.fuelType')} *
						</Text>
						<NativeSelect.Root w='full'>
							<NativeSelect.Field
								name='fuel_type'
								id='fuel_type'
								onChange={formik.handleChange}
								value={formik.values.fuel_type}
								required
							>
								{fuelTypes.map((option) => (
									<option key={option.value} value={option.value}>
										{t(`vehicles.fuelTypes.${option.value}`)}
									</option>
								))}
							</NativeSelect.Field>
							<NativeSelect.Indicator />
						</NativeSelect.Root>
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
							{t('vehicles.form.fields.registrationNumberOptional')}
						</Text>
						<Input
							type='text'
							name='registration_number'
							id='registration_number'
							onChange={formik.handleChange}
							value={formik.values.registration_number || ''}
							placeholder={t('vehicles.form.placeholders.registrationExample')}
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
						{showTechnical
							? t('vehicles.form.technicalToggle.hide')
							: t('vehicles.form.technicalToggle.show')}
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
									{t('vehicles.form.sections.technicalSpecifications')}
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
										{t('vehicles.form.fields.engineCapacityOptional')}
									</Text>
									<Input
										type='number'
										name='engine_capacity'
										id='engine_capacity'
										onChange={formik.handleChange}
										value={formik.values.engine_capacity || ''}
										placeholder={t(
											'vehicles.form.placeholders.engineCapacityExample'
										)}
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
										{t('vehicles.form.fields.enginePowerOptional')}
									</Text>
									<Input
										type='number'
										name='engine_power'
										id='engine_power'
										onChange={formik.handleChange}
										value={formik.values.engine_power || ''}
										placeholder={t(
											'vehicles.form.placeholders.enginePowerExample'
										)}
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
										{t('vehicles.form.fields.powerUnitOptional')}
									</Text>
									<NativeSelect.Root w='full'>
										<NativeSelect.Field
											name='power_unit'
											id='power_unit'
											onChange={formik.handleChange}
											value={formik.values.power_unit || ''}
										>
											<option value=''>
												{t('vehicles.form.placeholders.selectUnit')}
											</option>
											{powerUnits.map((option) => (
												<option key={option.value} value={option.value}>
													{option.value === 'HP'
														? t('vehicles.form.options.powerUnitHp')
														: t('vehicles.form.options.powerUnitKw')}
												</option>
											))}
										</NativeSelect.Field>
										<NativeSelect.Indicator />
									</NativeSelect.Root>
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
										{t('vehicles.form.fields.transmissionOptional')}
									</Text>
									<NativeSelect.Root w='full'>
										<NativeSelect.Field
											name='transmission'
											id='transmission'
											onChange={formik.handleChange}
											value={formik.values.transmission || ''}
										>
											<option value=''>
												{t('vehicles.form.placeholders.selectTransmission')}
											</option>
											{transmissionTypes.map((option) => (
												<option key={option.value} value={option.value}>
													{option.value === 'manual'
														? t('vehicles.detail.values.manual')
														: t('vehicles.detail.values.automatic')}
												</option>
											))}
										</NativeSelect.Field>
										<NativeSelect.Indicator />
									</NativeSelect.Root>
								</Box>
							</Box>
						</Collapsible.Content>
					</Collapsible.Root>
				</Box>

				{/* Submit Buttons */}
				<ButtonGroup mt='4' gap='3'>
					<Button
						loading={mutation.isPending}
						loadingText={t('vehicles.form.actions.submitting')}
						type='submit'
						colorPalette='blue'
					>
						{mode === 'create'
							? t('vehicles.form.actions.createVehicle')
							: t('vehicles.form.actions.saveChanges')}
					</Button>
					<Button variant='outline' onClick={backToVehicles}>
						{t('vehicles.form.actions.cancel')}
					</Button>
				</ButtonGroup>
			</form>
		</Box>
	);
};

export default VehicleForm;
