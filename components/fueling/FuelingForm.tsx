import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import {
	Box,
	Button,
	ButtonGroup,
	CardBody,
	CardRoot,
	createListCollection,
	Input,
	Select,
	Stack,
	Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useLocale } from '../../contexts/LocaleContext';
import {
	useFuelingDraft,
	useLastFuelingData,
	useCreateFueling,
	useUpdateFueling,
} from '../../hooks';
import { FuelingData, FuelingFormValues, VehicleData } from '../../types';
import { fuelTypes } from '../../types/vehicle_types';

interface FuelingFormProps {
	vehicle: VehicleData;
	initialData?: FuelingData;
	mode: 'create' | 'edit';
	onSubmitSuccess?: () => void;
}

const FuelingForm: React.FC<FuelingFormProps> = ({
	vehicle,
	initialData,
	mode,
	onSubmitSuccess,
}) => {
	const { locale, t } = useLocale();
	const createMutation = useCreateFueling();
	const updateMutation = useUpdateFueling();
	const { loadDraft, saveDraft, clearDraft } = useFuelingDraft(vehicle.id);
	const { data: lastFueling } = useLastFuelingData(vehicle.id);
	const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';

	const calculateCostPerUnit = (
		cost: string | number,
		quantity: string | number
	): number => {
		const costNum = typeof cost === 'string' ? parseFloat(cost) : cost;
		const quantityNum =
			typeof quantity === 'string' ? parseFloat(quantity) : quantity;
		if (costNum > 0 && quantityNum > 0) {
			return parseFloat((costNum / quantityNum).toFixed(3));
		}
		return 0;
	};

	const [mountDraft] = useState(() => {
		if (mode === 'create') {
			return loadDraft();
		}
		return null;
	});

	const initialValues = useMemo((): FuelingFormValues => {
		if (mode === 'edit' && initialData) {
			return {
				cost: initialData.cost.toString(),
				quantity: initialData.quantity.toString(),
				cost_per_unit: initialData.cost_per_unit,
				mileage: initialData.mileage.toString(),
				date: format(new Date(initialData.date), 'yyyy-MM-dd'),
				full_tank: initialData.full_tank,
				fuel_type: initialData.fuel_type,
				vehicle_id: vehicle.id,
				last_odometer: lastFueling?.mileage || vehicle.mileage,
			};
		}

		if (mountDraft) {
			return mountDraft as FuelingFormValues;
		}

		return {
			cost: '',
			quantity: '',
			cost_per_unit: 0,
			mileage: '',
			date: format(new Date(), 'yyyy-MM-dd'),
			full_tank: true,
			fuel_type: lastFueling?.fuel_type || vehicle.fuel_type || 'gasoline',
			vehicle_id: vehicle.id,
			last_odometer: lastFueling?.mileage || vehicle.mileage,
		};
	}, [
		mode,
		initialData?.id,
		initialData?.date,
		vehicle.id,
		vehicle.fuel_type,
		vehicle.mileage,
		lastFueling?.fuel_type,
		lastFueling?.mileage,
	]);

	const validate = (values: FuelingFormValues) => {
		const errors: Partial<Record<keyof FuelingFormValues, string>> = {};

		const costNum =
			typeof values.cost === 'string' ? parseFloat(values.cost) : values.cost;
		if (!values.cost || costNum <= 0) {
			errors.cost = t('fuelings.form.validation.costGreaterThanZero');
		}

		const quantityNum =
			typeof values.quantity === 'string'
				? parseFloat(values.quantity)
				: values.quantity;
		if (!values.quantity || quantityNum <= 0) {
			errors.quantity = t('fuelings.form.validation.quantityGreaterThanZero');
		}

		const mileageNum =
			typeof values.mileage === 'string'
				? parseFloat(values.mileage)
				: values.mileage;
		if (!values.mileage || mileageNum <= 0) {
			errors.mileage = t('fuelings.form.validation.mileageGreaterThanZero');
		}

		if (
			mode === 'create' &&
			values.last_odometer &&
			mileageNum <= values.last_odometer
		) {
			errors.mileage = `${t('fuelings.form.validation.mileageAboveLastPrefix')} (${values.last_odometer.toLocaleString(localeCode)})`;
		}

		if (!values.fuel_type || !values.fuel_type.trim()) {
			errors.fuel_type = t('fuelings.form.validation.fuelTypeRequired');
		}

		if (!values.date) {
			errors.date = t('fuelings.form.validation.dateRequired');
		}

		return errors;
	};

	const formik = useFormik({
		initialValues,
		validate,
		validateOnChange: false,
		validateOnBlur: true,
		enableReinitialize: true,
		onSubmit: (values) => {
			const submitData = {
				...values,
				cost:
					typeof values.cost === 'string'
						? parseFloat(values.cost)
						: values.cost,
				quantity:
					typeof values.quantity === 'string'
						? parseFloat(values.quantity)
						: values.quantity,
				mileage:
					typeof values.mileage === 'string'
						? parseFloat(values.mileage)
						: values.mileage,
			};

			if (mode === 'edit' && initialData) {
				updateMutation.mutate(
					{
						id: initialData.id,
						data: submitData,
						vehicleId: vehicle.id,
					},
					{
						onSuccess: () => {
							onSubmitSuccess?.();
						},
					}
				);
			} else {
				createMutation.mutate(
					{
						data: submitData,
						vehicleId: vehicle.id,
					},
					{
						onSuccess: () => {
							clearDraft();
							onSubmitSuccess?.();
						},
					}
				);
			}
		},
	});

	const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		formik.setFieldValue('cost', value);
		const newCostPerUnit = calculateCostPerUnit(value, formik.values.quantity);
		formik.setFieldValue('cost_per_unit', newCostPerUnit);
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		formik.setFieldValue('quantity', value);
		const newCostPerUnit = calculateCostPerUnit(formik.values.cost, value);
		formik.setFieldValue('cost_per_unit', newCostPerUnit);
	};

	useEffect(() => {
		if (mode === 'create' && formik.dirty) {
			saveDraft(formik.values);
		}
	}, [formik.dirty, formik.values, mode, saveDraft]);

	const isLoading = createMutation.isPending || updateMutation.isPending;
	const hasCostError = Boolean(formik.touched.cost && formik.errors.cost);
	const hasQuantityError = Boolean(
		formik.touched.quantity && formik.errors.quantity
	);
	const hasMileageError = Boolean(
		formik.touched.mileage && formik.errors.mileage
	);
	const hasDateError = Boolean(formik.touched.date && formik.errors.date);
	const hasFuelTypeError = Boolean(
		formik.touched.fuel_type && formik.errors.fuel_type
	);
	const hasLastOdometer =
		typeof formik.values.last_odometer === 'number' &&
		formik.values.last_odometer > 0;

	const fuelTypeCollection = createListCollection({
		items: fuelTypes.map((option) => ({
			label: t(`vehicles.fuelTypes.${option.value}`),
			value: option.value,
		})),
	});

	const handleTankTypeSelect = (fullTank: boolean) => {
		formik.setFieldValue('full_tank', fullTank);
	};

	return (
		<CardRoot variant='outline' w='full'>
			<CardBody>
				<form onSubmit={formik.handleSubmit}>
					<Box mb='6'>
						<Text fontSize='lg' fontWeight='semibold' mb='4'>
							{t('fuelings.form.sections.fuelingDetails')}
						</Text>

						<Stack direction={{ base: 'column', md: 'row' }} gap='4' mb='4'>
							<Box flex='1'>
								<Box
									as='label'
									fontSize='sm'
									fontWeight='medium'
									mb='2'
									display='block'
								>
									{t('fuelings.form.fields.totalCost')} *
								</Box>
								<Input
									name='cost'
									id='cost'
									type='number'
									step='0.01'
									min='0'
									value={formik.values.cost}
									onChange={handleCostChange}
									onBlur={formik.handleBlur}
									placeholder='0.00'
									borderColor={hasCostError ? 'red.500' : undefined}
									aria-invalid={hasCostError || undefined}
									required
								/>
								{hasCostError && (
									<Text color='red.500' fontSize='xs' mt='1'>
										{formik.errors.cost}
									</Text>
								)}
							</Box>

							<Box flex='1'>
								<Box
									as='label'
									fontSize='sm'
									fontWeight='medium'
									mb='2'
									display='block'
								>
									{t('fuelings.form.fields.quantity')} *
								</Box>
								<Input
									name='quantity'
									id='quantity'
									type='number'
									step='0.01'
									min='0'
									value={formik.values.quantity}
									onChange={handleQuantityChange}
									onBlur={formik.handleBlur}
									placeholder='0.00'
									borderColor={hasQuantityError ? 'red.500' : undefined}
									aria-invalid={hasQuantityError || undefined}
									required
								/>
								{hasQuantityError && (
									<Text color='red.500' fontSize='xs' mt='1'>
										{formik.errors.quantity}
									</Text>
								)}
							</Box>
						</Stack>

						<Box mb='4'>
							<Box
								as='label'
								fontSize='sm'
								fontWeight='medium'
								mb='2'
								display='block'
							>
								{t('fuelings.form.fields.costPerUnit')}
							</Box>
							<Input
								name='cost_per_unit'
								id='cost_per_unit'
								type='number'
								step='0.001'
								value={formik.values.cost_per_unit.toFixed(3)}
								readOnly
								bg='gray.50'
							/>
							<Text fontSize='xs' color='gray.500' mt='1'>
								{vehicle.currency}/L • {t('fuelings.form.hints.autoCalculated')}
							</Text>
						</Box>

						<Box>
							<Box
								as='label'
								fontSize='sm'
								fontWeight='medium'
								mb='2'
								display='block'
							>
								{t('fuelings.form.fields.fuelType')} *
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
							{hasFuelTypeError && (
								<Text color='red.500' fontSize='xs' mt='1'>
									{formik.errors.fuel_type}
								</Text>
							)}
						</Box>
					</Box>

					<Box mb='6'>
						<Text fontSize='lg' fontWeight='semibold' mb='4'>
							{t('fuelings.form.sections.tripDetails')}
						</Text>

						<Stack direction={{ base: 'column', md: 'row' }} gap='4' mb='4'>
							<Box flex='1'>
								<Box
									as='label'
									fontSize='sm'
									fontWeight='medium'
									mb='2'
									display='block'
								>
									{t('fuelings.form.fields.mileage')} *
								</Box>
								<Input
									name='mileage'
									id='mileage'
									type='number'
									step='1'
									min='0'
									value={formik.values.mileage}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder={
										hasLastOdometer
											? formik.values.last_odometer?.toString()
											: ''
									}
									borderColor={hasMileageError ? 'red.500' : undefined}
									aria-invalid={hasMileageError || undefined}
									required
								/>
								{hasMileageError && (
									<Text color='red.500' fontSize='xs' mt='1'>
										{formik.errors.mileage}
									</Text>
								)}
								{hasLastOdometer && (
									<Text fontSize='xs' color='gray.500' mt='1'>
										{t('fuelings.form.hints.lastRecorded')}{' '}
										{formik.values.last_odometer.toLocaleString(localeCode)}{' '}
										{vehicle.mileage_unit}
									</Text>
								)}
							</Box>

							<Box flex='1'>
								<Box
									as='label'
									fontSize='sm'
									fontWeight='medium'
									mb='2'
									display='block'
								>
									{t('fuelings.form.fields.date')} *
								</Box>
								<Input
									name='date'
									id='date'
									type='date'
									value={formik.values.date}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									borderColor={hasDateError ? 'red.500' : undefined}
									aria-invalid={hasDateError || undefined}
									required
								/>
								{hasDateError && (
									<Text color='red.500' fontSize='xs' mt='1'>
										{formik.errors.date}
									</Text>
								)}
							</Box>
						</Stack>

						<Box>
							<Text fontSize='sm' fontWeight='medium' mb='2'>
								{t('fuelings.form.fields.tankType')}
							</Text>
							<ButtonGroup size='sm' variant='outline' mb='2'>
								<Button
									type='button'
									variant={formik.values.full_tank ? 'solid' : 'outline'}
									colorPalette='blue'
									onClick={() => handleTankTypeSelect(true)}
								>
									{t('fuelings.form.tankType.full')}
								</Button>
								<Button
									type='button'
									variant={formik.values.full_tank ? 'outline' : 'solid'}
									colorPalette='blue'
									onClick={() => handleTankTypeSelect(false)}
								>
									{t('fuelings.form.tankType.partial')}
								</Button>
							</ButtonGroup>
							<Text fontSize='xs' color='gray.500'>
								{formik.values.full_tank
									? t('fuelings.form.hints.fullTankSelected')
									: t('fuelings.form.hints.partialTankSelected')}
							</Text>
						</Box>
					</Box>

					<ButtonGroup mt='4' gap='3'>
						<Button
							type='submit'
							colorPalette='blue'
							loading={isLoading}
							loadingText={
								mode === 'create'
									? t('fuelings.form.actions.adding')
									: t('fuelings.form.actions.saving')
							}
						>
							{mode === 'create'
								? t('fuelings.form.actions.addFueling')
								: t('fuelings.form.actions.saveChanges')}
						</Button>
						<Button
							type='button'
							variant='outline'
							onClick={onSubmitSuccess}
							disabled={isLoading}
						>
							{t('fuelings.form.actions.cancel')}
						</Button>
					</ButtonGroup>
				</form>
			</CardBody>
		</CardRoot>
	);
};

export default FuelingForm;
