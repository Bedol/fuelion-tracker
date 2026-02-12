// @ts-nocheck - Chakra v3 compound form components still have typing gaps in this file
import {
	Box,
	Button,
	ButtonGroup,
	CardBody,
	CardRoot,
	Collapsible,
	createListCollection,
	Input,
	Select,
	Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import {
	fuelTypes,
	powerUnits,
	transmissionTypes,
} from '../../types/vehicle_types';

type VehicleFormValues = {
	brand_name: string;
	model_name: string;
	production_year: number | string;
	fuel_type: string;
	registration_number?: string;
	engine_capacity?: number | string;
	engine_power?: number | string;
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

	const hasTechnicalData =
		initialValues.engine_capacity != null ||
		initialValues.engine_power != null ||
		(typeof initialValues.power_unit === 'string' &&
			initialValues.power_unit.trim() !== '') ||
		(typeof initialValues.transmission === 'string' &&
			initialValues.transmission.trim() !== '');

	useEffect(() => {
		setShowTechnical(hasTechnicalData);
	}, [hasTechnicalData]);

	const validatePositiveInteger = (value: number | string | undefined) => {
		if (value === undefined || value === null || value === '') {
			return true;
		}

		const parsedValue = Number(value);
		return Number.isInteger(parsedValue) && parsedValue > 0;
	};

	const formik = useFormik({
		initialValues,
		validate: (values) => {
			const errors: Partial<Record<keyof VehicleFormValues, string>> = {};

			if (!values.brand_name.trim()) {
				errors.brand_name = t('vehicles.form.validation.brandRequired');
			}

			if (!values.model_name.trim()) {
				errors.model_name = t('vehicles.form.validation.modelRequired');
			}

			if (!values.fuel_type.trim()) {
				errors.fuel_type = t('vehicles.form.validation.fuelTypeRequired');
			}

			if (
				values.production_year === '' ||
				values.production_year === null ||
				values.production_year === undefined
			) {
				errors.production_year = t(
					'vehicles.form.validation.productionYearRequired'
				);
			} else {
				const parsedYear = Number(values.production_year);
				if (!Number.isInteger(parsedYear)) {
					errors.production_year = t(
						'vehicles.form.validation.productionYearInvalid'
					);
				} else if (parsedYear < 1900 || parsedYear > currentYear + 1) {
					errors.production_year = t(
						'vehicles.form.validation.productionYearRange'
					);
				}
			}

			if (!validatePositiveInteger(values.engine_capacity)) {
				errors.engine_capacity = t(
					'vehicles.form.validation.engineCapacityInvalid'
				);
			}

			if (!validatePositiveInteger(values.engine_power)) {
				errors.engine_power = t('vehicles.form.validation.enginePowerInvalid');
			}

			return errors;
		},
		onSubmit: (values) => {
			mutation.mutate({
				...values,
				brand_name: values.brand_name.trim(),
				model_name: values.model_name.trim(),
				production_year: Number(values.production_year),
				registration_number: values.registration_number?.trim() || '',
			});
		},
		enableReinitialize: true,
	});

	const hasBrandError = Boolean(
		formik.touched.brand_name && formik.errors.brand_name
	);
	const hasModelError = Boolean(
		formik.touched.model_name && formik.errors.model_name
	);
	const hasProductionYearError = Boolean(
		formik.touched.production_year && formik.errors.production_year
	);
	const hasFuelTypeError = Boolean(
		formik.touched.fuel_type && formik.errors.fuel_type
	);
	const hasEngineCapacityError = Boolean(
		formik.touched.engine_capacity && formik.errors.engine_capacity
	);
	const hasEnginePowerError = Boolean(
		formik.touched.engine_power && formik.errors.engine_power
	);

	const fuelTypeCollection = createListCollection({
		items: fuelTypes.map((option) => ({
			label: t(`vehicles.fuelTypes.${option.value}`),
			value: option.value,
		})),
	});

	const powerUnitCollection = createListCollection({
		items: [
			{ label: t('vehicles.form.placeholders.selectUnit'), value: '' },
			...powerUnits.map((option) => ({
				label:
					option.value === 'HP'
						? t('vehicles.form.options.powerUnitHp')
						: t('vehicles.form.options.powerUnitKw'),
				value: option.value,
			})),
		],
	});

	const transmissionCollection = createListCollection({
		items: [
			{ label: t('vehicles.form.placeholders.selectTransmission'), value: '' },
			...transmissionTypes.map((option) => ({
				label:
					option.value === 'manual'
						? t('vehicles.detail.values.manual')
						: t('vehicles.detail.values.automatic'),
				value: option.value,
			})),
		],
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
		<CardRoot variant='outline' w='full'>
			<CardBody>
				<form onSubmit={formik.handleSubmit}>
					{/* Section 1: Basic Information */}
					<Box mb='6'>
						<Text fontSize='lg' fontWeight='semibold' mb='4'>
							{t('vehicles.form.sections.basicInformation')}
						</Text>

						<Box mb='4'>
							<Box
								as='label'
								fontSize='sm'
								fontWeight='medium'
								mb='2'
								display='block'
							>
								{t('vehicles.form.fields.brand')} *
							</Box>
							<Input
								type='text'
								name='brand_name'
								id='brand_name'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.brand_name}
								placeholder={t('vehicles.form.placeholders.brandExample')}
								borderColor={hasBrandError ? 'red.500' : undefined}
								aria-invalid={hasBrandError || undefined}
								_focusVisible={
									hasBrandError ? { borderColor: 'red.500' } : undefined
								}
								required
							/>
							{formik.touched.brand_name && formik.errors.brand_name && (
								<Text color='red.500' fontSize='xs' mt='1'>
									{formik.errors.brand_name}
								</Text>
							)}
						</Box>

						<Box mb='4'>
							<Box
								as='label'
								fontSize='sm'
								fontWeight='medium'
								mb='2'
								display='block'
							>
								{t('vehicles.form.fields.model')} *
							</Box>
							<Input
								type='text'
								name='model_name'
								id='model_name'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.model_name}
								placeholder={t('vehicles.form.placeholders.modelExample')}
								borderColor={hasModelError ? 'red.500' : undefined}
								aria-invalid={hasModelError || undefined}
								_focusVisible={
									hasModelError ? { borderColor: 'red.500' } : undefined
								}
								required
							/>
							{formik.touched.model_name && formik.errors.model_name && (
								<Text color='red.500' fontSize='xs' mt='1'>
									{formik.errors.model_name}
								</Text>
							)}
						</Box>

						<Box mb='4'>
							<Box
								as='label'
								fontSize='sm'
								fontWeight='medium'
								mb='2'
								display='block'
							>
								{t('vehicles.form.fields.productionYear')} *
							</Box>
							<Input
								type='number'
								name='production_year'
								id='production_year'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.production_year}
								min={1900}
								max={currentYear + 1}
								step={1}
								borderColor={hasProductionYearError ? 'red.500' : undefined}
								aria-invalid={hasProductionYearError || undefined}
								_focusVisible={
									hasProductionYearError
										? { borderColor: 'red.500' }
										: undefined
								}
								required
							/>
							{formik.touched.production_year &&
								formik.errors.production_year && (
									<Text color='red.500' fontSize='xs' mt='1'>
										{formik.errors.production_year}
									</Text>
								)}
						</Box>

						<Box mb='4'>
							<Box
								as='label'
								fontSize='sm'
								fontWeight='medium'
								mb='2'
								display='block'
							>
								{t('vehicles.form.fields.fuelType')} *
							</Box>
							{/* @ts-ignore */}
							<Select.Root
								collection={fuelTypeCollection}
								value={formik.values.fuel_type ? [formik.values.fuel_type] : []}
								onValueChange={(details) => {
									formik.setFieldValue('fuel_type', details.value[0] || '');
									formik.setFieldTouched('fuel_type', true, true);
								}}
								positioning={{
									placement: 'bottom-start',
									flip: false,
									sameWidth: true,
								}}
							>
								{/* @ts-ignore */}
								<Select.HiddenSelect name='fuel_type' id='fuel_type' />
								{/* @ts-ignore */}
								<Select.Control>
									{/* @ts-ignore */}
									<Select.Trigger
										borderColor={hasFuelTypeError ? 'red.500' : undefined}
										aria-invalid={hasFuelTypeError || undefined}
										_focusVisible={
											hasFuelTypeError ? { borderColor: 'red.500' } : undefined
										}
									>
										{/* @ts-ignore */}
										<Select.ValueText />
										{/* @ts-ignore */}
										<Select.IndicatorGroup>
											{/* @ts-ignore */}
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Trigger>
								</Select.Control>
								{/* @ts-ignore */}
								<Select.Positioner>
									{/* @ts-ignore */}
									<Select.Content>
										{fuelTypeCollection.items.map((item) => (
											/* @ts-ignore */
											<Select.Item key={item.value} item={item}>
												{/* @ts-ignore */}
												<Select.ItemText>{item.label}</Select.ItemText>
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</Select.Root>
							{formik.touched.fuel_type && formik.errors.fuel_type && (
								<Text color='red.500' fontSize='xs' mt='1'>
									{formik.errors.fuel_type}
								</Text>
							)}
						</Box>

						<Box mb='4'>
							<Box
								as='label'
								fontSize='sm'
								fontWeight='medium'
								mb='2'
								display='block'
							>
								{t('vehicles.form.fields.registrationNumberOptional')}
							</Box>
							<Input
								type='text'
								name='registration_number'
								id='registration_number'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.registration_number || ''}
								placeholder={t(
									'vehicles.form.placeholders.registrationExample'
								)}
							/>
						</Box>
					</Box>

					{/* Section 2: Technical Data (Collapsible) */}
					<Box mb='6'>
						<Button
							type='button'
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
										<Box
											as='label'
											fontSize='sm'
											fontWeight='medium'
											mb='2'
											display='block'
										>
											{t('vehicles.form.fields.engineCapacityOptional')}
										</Box>
										<Input
											type='number'
											name='engine_capacity'
											id='engine_capacity'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.engine_capacity || ''}
											min={1}
											step={1}
											placeholder={t(
												'vehicles.form.placeholders.engineCapacityExample'
											)}
											borderColor={
												hasEngineCapacityError ? 'red.500' : undefined
											}
											aria-invalid={hasEngineCapacityError || undefined}
											_focusVisible={
												hasEngineCapacityError
													? { borderColor: 'red.500' }
													: undefined
											}
										/>
										{formik.touched.engine_capacity &&
											formik.errors.engine_capacity && (
												<Text color='red.500' fontSize='xs' mt='1'>
													{formik.errors.engine_capacity}
												</Text>
											)}
									</Box>

									<Box mb='4'>
										<Box
											as='label'
											fontSize='sm'
											fontWeight='medium'
											mb='2'
											display='block'
										>
											{t('vehicles.form.fields.enginePowerOptional')}
										</Box>
										<Input
											type='number'
											name='engine_power'
											id='engine_power'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.engine_power || ''}
											min={1}
											step={1}
											placeholder={t(
												'vehicles.form.placeholders.enginePowerExample'
											)}
											borderColor={hasEnginePowerError ? 'red.500' : undefined}
											aria-invalid={hasEnginePowerError || undefined}
											_focusVisible={
												hasEnginePowerError
													? { borderColor: 'red.500' }
													: undefined
											}
										/>
										{formik.touched.engine_power &&
											formik.errors.engine_power && (
												<Text color='red.500' fontSize='xs' mt='1'>
													{formik.errors.engine_power}
												</Text>
											)}
									</Box>

									<Box mb='4'>
										<Box
											as='label'
											fontSize='sm'
											fontWeight='medium'
											mb='2'
											display='block'
										>
											{t('vehicles.form.fields.powerUnitOptional')}
										</Box>
										{/* @ts-ignore */}
										<Select.Root
											collection={powerUnitCollection}
											value={
												formik.values.power_unit
													? [formik.values.power_unit]
													: ['']
											}
											onValueChange={(details) => {
												formik.setFieldValue(
													'power_unit',
													details.value[0] || ''
												);
											}}
											positioning={{
												placement: 'bottom-start',
												flip: false,
												sameWidth: true,
											}}
										>
											{/* @ts-ignore */}
											<Select.HiddenSelect name='power_unit' id='power_unit' />
											{/* @ts-ignore */}
											<Select.Control>
												{/* @ts-ignore */}
												<Select.Trigger>
													{/* @ts-ignore */}
													<Select.ValueText
														placeholder={t(
															'vehicles.form.placeholders.selectUnit'
														)}
													/>
													{/* @ts-ignore */}
													<Select.IndicatorGroup>
														{/* @ts-ignore */}
														<Select.Indicator />
													</Select.IndicatorGroup>
												</Select.Trigger>
											</Select.Control>
											{/* @ts-ignore */}
											<Select.Positioner>
												{/* @ts-ignore */}
												<Select.Content>
													{powerUnitCollection.items.map((item) => (
														/* @ts-ignore */
														<Select.Item
															key={item.value || 'empty'}
															item={item}
														>
															{/* @ts-ignore */}
															<Select.ItemText>{item.label}</Select.ItemText>
														</Select.Item>
													))}
												</Select.Content>
											</Select.Positioner>
										</Select.Root>
									</Box>

									<Box mb='4'>
										<Box
											as='label'
											fontSize='sm'
											fontWeight='medium'
											mb='2'
											display='block'
										>
											{t('vehicles.form.fields.transmissionOptional')}
										</Box>
										{/* @ts-ignore */}
										<Select.Root
											collection={transmissionCollection}
											value={
												formik.values.transmission
													? [formik.values.transmission]
													: ['']
											}
											onValueChange={(details) => {
												formik.setFieldValue(
													'transmission',
													details.value[0] || ''
												);
											}}
											positioning={{
												placement: 'bottom-start',
												flip: false,
												sameWidth: true,
											}}
										>
											{/* @ts-ignore */}
											<Select.HiddenSelect
												name='transmission'
												id='transmission'
											/>
											{/* @ts-ignore */}
											<Select.Control>
												{/* @ts-ignore */}
												<Select.Trigger>
													{/* @ts-ignore */}
													<Select.ValueText
														placeholder={t(
															'vehicles.form.placeholders.selectTransmission'
														)}
													/>
													{/* @ts-ignore */}
													<Select.IndicatorGroup>
														{/* @ts-ignore */}
														<Select.Indicator />
													</Select.IndicatorGroup>
												</Select.Trigger>
											</Select.Control>
											{/* @ts-ignore */}
											<Select.Positioner>
												{/* @ts-ignore */}
												<Select.Content>
													{transmissionCollection.items.map((item) => (
														/* @ts-ignore */
														<Select.Item
															key={item.value || 'empty'}
															item={item}
														>
															{/* @ts-ignore */}
															<Select.ItemText>{item.label}</Select.ItemText>
														</Select.Item>
													))}
												</Select.Content>
											</Select.Positioner>
										</Select.Root>
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
						<Button type='button' variant='outline' onClick={backToVehicles}>
							{t('vehicles.form.actions.cancel')}
						</Button>
					</ButtonGroup>
				</form>
			</CardBody>
		</CardRoot>
	);
};

export default VehicleForm;
