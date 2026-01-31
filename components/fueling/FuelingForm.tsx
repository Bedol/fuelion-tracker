import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Box, Button, ButtonGroup, Input, Text } from '@chakra-ui/react';
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

		const costNum =
			typeof values.cost === 'string' ? parseFloat(values.cost) : values.cost;
		if (!values.cost || costNum <= 0) {
			errors.cost = 'Total cost must be greater than 0';
		}

		const quantityNum =
			typeof values.quantity === 'string'
				? parseFloat(values.quantity)
				: values.quantity;
		if (!values.quantity || quantityNum <= 0) {
			errors.quantity = 'Quantity must be greater than 0';
		}

		const mileageNum =
			typeof values.mileage === 'string'
				? parseFloat(values.mileage)
				: values.mileage;
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
				<Box mb='4'>
					<label
						style={{
							display: 'block',
							marginBottom: '0.5rem',
							fontSize: '0.875rem',
							fontWeight: '500',
						}}
					>
						Total Price Paid *
					</label>
					<Input
						name='cost'
						type='number'
						step='0.01'
						min='0'
						value={formik.values.cost}
						onChange={handleCostChange}
						onBlur={formik.handleBlur}
						placeholder='0.00'
						borderColor={
							formik.errors.cost && formik.touched.cost ? 'red.500' : undefined
						}
					/>
					{formik.errors.cost && formik.touched.cost && (
						<Text color='red.500' fontSize='sm' mt='1'>
							{formik.errors.cost}
						</Text>
					)}
				</Box>

				{/* Liters */}
				<Box mb='4'>
					<label
						style={{
							display: 'block',
							marginBottom: '0.5rem',
							fontSize: '0.875rem',
							fontWeight: '500',
						}}
					>
						Liters *
					</label>
					<Input
						name='quantity'
						type='number'
						step='0.01'
						min='0'
						value={formik.values.quantity}
						onChange={handleQuantityChange}
						onBlur={formik.handleBlur}
						placeholder='0.00'
						borderColor={
							formik.errors.quantity && formik.touched.quantity
								? 'red.500'
								: undefined
						}
					/>
					{formik.errors.quantity && formik.touched.quantity && (
						<Text color='red.500' fontSize='sm' mt='1'>
							{formik.errors.quantity}
						</Text>
					)}
				</Box>

				{/* Price per Liter (read-only) */}
				<Box mb='4'>
					<label
						style={{
							display: 'block',
							marginBottom: '0.5rem',
							fontSize: '0.875rem',
							fontWeight: '500',
						}}
					>
						Price per Liter
					</label>
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
				</Box>

				{/* Full Tank Toggle */}
				<Box mb='4'>
					<label
						style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					>
						<input
							type='checkbox'
							name='full_tank'
							checked={formik.values.full_tank}
							onChange={(e) =>
								formik.setFieldValue('full_tank', e.target.checked)
							}
							style={{ marginRight: '0.5rem', cursor: 'pointer' }}
						/>
						<span style={{ fontSize: '0.875rem' }}>
							Full Tank:{' '}
							{formik.values.full_tank
								? 'Yes - Full tank fill'
								: 'No - Partial fill'}
						</span>
					</label>
				</Box>

				{/* Odometer */}
				<Box mb='4'>
					<label
						style={{
							display: 'block',
							marginBottom: '0.5rem',
							fontSize: '0.875rem',
							fontWeight: '500',
						}}
					>
						Odometer Reading *
					</label>
					<Input
						name='mileage'
						type='number'
						step='1'
						min='0'
						value={formik.values.mileage}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder={formik.values.last_odometer?.toString()}
						borderColor={
							formik.errors.mileage && formik.touched.mileage
								? 'red.500'
								: undefined
						}
					/>
					{formik.errors.mileage && formik.touched.mileage && (
						<Text color='red.500' fontSize='sm' mt='1'>
							{formik.errors.mileage}
						</Text>
					)}
					{formik.values.last_odometer && (
						<Text fontSize='sm' color='gray.500' mt='1'>
							Last recorded: {formik.values.last_odometer.toLocaleString()}{' '}
							{vehicle.mileage_unit}
						</Text>
					)}
				</Box>

				{/* Date */}
				<Box mb='4'>
					<label
						style={{
							display: 'block',
							marginBottom: '0.5rem',
							fontSize: '0.875rem',
							fontWeight: '500',
						}}
					>
						Date *
					</label>
					<Input
						name='date'
						type='date'
						value={formik.values.date}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						borderColor={
							formik.errors.date && formik.touched.date ? 'red.500' : undefined
						}
					/>
					{formik.errors.date && formik.touched.date && (
						<Text color='red.500' fontSize='sm' mt='1'>
							{formik.errors.date}
						</Text>
					)}
				</Box>

				{/* Fuel Type */}
				<Box mb='4'>
					<label
						style={{
							display: 'block',
							marginBottom: '0.5rem',
							fontSize: '0.875rem',
							fontWeight: '500',
						}}
					>
						Fuel Type *
					</label>
					<select
						name='fuel_type'
						value={formik.values.fuel_type}
						onChange={formik.handleChange}
						style={{
							width: '100%',
							padding: '0.5rem',
							borderWidth: '1px',
							borderRadius: '0.375rem',
							fontSize: '1rem',
						}}
					>
						<option value='gasoline'>Gasoline</option>
						<option value='diesel'>Diesel</option>
						<option value='lpg'>LPG</option>
						<option value='electric'>Electric</option>
						<option value='hybrid'>Hybrid</option>
					</select>
				</Box>

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
