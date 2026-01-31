import { useEffect } from 'react';
import { useFormik } from 'formik';
import {
	Box,
	Button,
	ButtonGroup,
	Field,
	Input,
	Switch,
	Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import {
	useFuelingDraft,
	useLastFuelingData,
	useCreateFueling,
	useUpdateFueling,
} from '../../hooks';
import { FuelingData, FuelingFormValues, VehicleData } from '../../types';

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
	const createMutation = useCreateFueling();
	const updateMutation = useUpdateFueling();
	const { loadDraft, saveDraft, clearDraft } = useFuelingDraft(vehicle.id);
	const { data: lastFueling } = useLastFuelingData(vehicle.id);

	// Calculate cost_per_unit from cost and quantity
	const calculateCostPerUnit = (cost: string, quantity: string): number => {
		const costNum = parseFloat(cost);
		const quantityNum = parseFloat(quantity);
		if (costNum > 0 && quantityNum > 0) {
			return parseFloat((costNum / quantityNum).toFixed(3));
		}
		return 0;
	};

	// Get smart defaults for create mode
	const getSmartDefaults = (): Partial<FuelingFormValues> => {
		const draft = loadDraft();
		if (draft) {
			return draft as FuelingFormValues;
		}

		return {
			date: format(new Date(), 'yyyy-MM-dd'),
			fuel_type: lastFueling?.fuel_type || vehicle.fuel_type || 'gasoline',
			full_tank: true,
			last_odometer: lastFueling?.mileage || vehicle.mileage,
		};
	};

	// Get initial values based on mode
	const getInitialValues = (): FuelingFormValues => {
		if (mode === 'edit' && initialData) {
			return {
				cost: initialData.cost.toString(),
				quantity: initialData.quantity.toString(),
				cost_per_unit: initialData.cost_per_unit,
				mileage: initialData.mileage.toString(),
				date: initialData.date,
				full_tank: initialData.full_tank,
				fuel_type: initialData.fuel_type,
				vehicle_id: vehicle.id,
				last_odometer: lastFueling?.mileage || vehicle.mileage,
			};
		}

		const smartDefaults = getSmartDefaults();
		return {
			cost: '',
			quantity: '',
			cost_per_unit: 0,
			mileage: '',
			date: smartDefaults.date || format(new Date(), 'yyyy-MM-dd'),
			full_tank: smartDefaults.full_tank ?? true,
			fuel_type: smartDefaults.fuel_type || vehicle.fuel_type || 'gasoline',
			vehicle_id: vehicle.id,
			last_odometer: smartDefaults.last_odometer || vehicle.mileage,
		};
	};

	// Validation function
	const validate = (values: FuelingFormValues) => {
		const errors: Partial<Record<keyof FuelingFormValues, string>> = {};

		const costNum = parseFloat(values.cost);
		if (!values.cost || costNum <= 0) {
			errors.cost = 'Total cost must be greater than 0';
		}

		const quantityNum = parseFloat(values.quantity);
		if (!values.quantity || quantityNum <= 0) {
			errors.quantity = 'Quantity must be greater than 0';
		}

		const mileageNum = parseFloat(values.mileage);
		if (!values.mileage || mileageNum <= 0) {
			errors.mileage = 'Odometer reading must be greater than 0';
		}

		if (values.last_odometer && mileageNum <= values.last_odometer) {
			errors.mileage = `Odometer must be greater than last reading (${values.last_odometer})`;
		}

		if (!values.date) {
			errors.date = 'Date is required';
		}

		return errors;
	};

	const formik = useFormik({
		initialValues: getInitialValues(),
		validate,
		validateOnChange: false,
		validateOnBlur: true,
		enableReinitialize: true,
		onSubmit: (values) => {
			const submitData = {
				...values,
				cost: parseFloat(values.cost),
				quantity: parseFloat(values.quantity),
				mileage: parseFloat(values.mileage),
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

	// Handle cost change with live calculation
	const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		formik.setFieldValue('cost', value);
		const newCostPerUnit = calculateCostPerUnit(value, formik.values.quantity);
		formik.setFieldValue('cost_per_unit', newCostPerUnit);
	};

	// Handle quantity change with live calculation
	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		formik.setFieldValue('quantity', value);
		const newCostPerUnit = calculateCostPerUnit(formik.values.cost, value);
		formik.setFieldValue('cost_per_unit', newCostPerUnit);
	};

	// Auto-save draft in create mode
	useEffect(() => {
		if (mode === 'create' && formik.dirty) {
			saveDraft(formik.values);
		}
	}, [formik.values, formik.dirty, mode, saveDraft]);

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Box maxW='600px'>
			<form onSubmit={formik.handleSubmit}>
				{/* Total Price Paid */}
				<Field
					label='Total Price Paid'
					required
					invalid={!!formik.errors.cost && formik.touched.cost}
					errorText={formik.errors.cost}
					mb='4'
				>
					<Input
						name='cost'
						type='number'
						step='0.01'
						min='0'
						value={formik.values.cost}
						onChange={handleCostChange}
						onBlur={formik.handleBlur}
						placeholder='0.00'
					/>
				</Field>

				{/* Liters */}
				<Field
					label='Liters'
					required
					invalid={!!formik.errors.quantity && formik.touched.quantity}
					errorText={formik.errors.quantity}
					mb='4'
				>
					<Input
						name='quantity'
						type='number'
						step='0.01'
						min='0'
						value={formik.values.quantity}
						onChange={handleQuantityChange}
						onBlur={formik.handleBlur}
						placeholder='0.00'
					/>
				</Field>

				{/* Price per Liter (read-only) */}
				<Field label='Price per Liter' mb='4'>
					<Input
						name='cost_per_unit'
						type='number'
						step='0.001'
						value={formik.values.cost_per_unit.toFixed(3)}
						readOnly
						bg='gray.50'
					/>
					<Text fontSize='sm' color='gray.500' mt='1'>
						{vehicle.currency}/L (auto-calculated)
					</Text>
				</Field>

				{/* Full Tank Toggle */}
				<Field label='Full Tank' mb='4'>
					<Switch
						checked={formik.values.full_tank}
						onCheckedChange={(details) =>
							formik.setFieldValue('full_tank', details.checked)
						}
						size='lg'
					>
						<Text as='span' ml='2'>
							{formik.values.full_tank
								? 'Yes - Full tank fill'
								: 'No - Partial fill'}
						</Text>
					</Switch>
				</Field>

				{/* Odometer */}
				<Field
					label='Odometer Reading'
					required
					invalid={!!formik.errors.mileage && formik.touched.mileage}
					errorText={formik.errors.mileage}
					mb='4'
				>
					<Input
						name='mileage'
						type='number'
						step='1'
						min='0'
						value={formik.values.mileage}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder={formik.values.last_odometer?.toString()}
					/>
					{formik.values.last_odometer && (
						<Text fontSize='sm' color='gray.500' mt='1'>
							Last recorded: {formik.values.last_odometer.toLocaleString()}{' '}
							{vehicle.mileage_unit}
						</Text>
					)}
				</Field>

				{/* Date */}
				<Field
					label='Date'
					required
					invalid={!!formik.errors.date && formik.touched.date}
					errorText={formik.errors.date}
					mb='4'
				>
					<Input
						name='date'
						type='date'
						value={formik.values.date}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</Field>

				{/* Fuel Type */}
				<Field label='Fuel Type' required mb='4'>
					<Box
						as='select'
						name='fuel_type'
						value={formik.values.fuel_type}
						onChange={formik.handleChange}
						className='chakra-select'
						p='2'
						borderWidth='1px'
						borderRadius='md'
						w='full'
					>
						<option value='gasoline'>Gasoline</option>
						<option value='diesel'>Diesel</option>
						<option value='lpg'>LPG</option>
						<option value='electric'>Electric</option>
						<option value='hybrid'>Hybrid</option>
					</Box>
				</Field>

				{/* Submit Buttons */}
				<ButtonGroup mt='6' gap='3'>
					<Button
						type='submit'
						colorPalette='blue'
						loading={isLoading}
						loadingText={mode === 'create' ? 'Adding...' : 'Saving...'}
					>
						{mode === 'create' ? 'Add Fueling' : 'Save Changes'}
					</Button>
					<Button
						type='button'
						variant='outline'
						onClick={onSubmitSuccess}
						disabled={isLoading}
					>
						Cancel
					</Button>
				</ButtonGroup>
			</form>
		</Box>
	);
};

export default FuelingForm;
