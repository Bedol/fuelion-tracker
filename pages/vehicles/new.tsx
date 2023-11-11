import { Vehicle } from '@prisma/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { fuelTypes, SelectOptionType } from '../../types/vehicle_types';

const powerUnits: SelectOptionType[] = [
	{ id: 1, name: 'Horese Power', value: 'HP' },
	{ id: 2, name: 'Kilo Wats', value: 'kW' },
];

const vehicleTypes: SelectOptionType[] = [
	{ id: 1, name: 'Car', value: 'CAR' },
	{ id: 2, name: 'Truck', value: 'TRUCK' },
	{ id: 3, name: 'Motorcycle', value: 'MOTORCYCLE' },
];

// TODO: move this type to global types
const mileageUnits: SelectOptionType[] = [
	{ id: 1, name: 'Kilometers', value: 'KM' },
	{ id: 2, name: 'Miles', value: 'MIL' },
];

// TODO: Convert whole form to new component
const NewVehicleForm = () => {
	const router = useRouter();
	const vehicleMutation = useMutation({
		mutationFn: (values: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) =>
			fetch('/api/vehicles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})
	});

	const { data: session, status } = useSession();

	if (status == 'loading') {
		return <p>Loading...</p>;
	}

	if (status === 'unauthenticated') {
		return <p>You need to signin first</p>;
	}

	const initialFormValues = {
		user_id: session.user.id,
		brand_name: '',
		model_name: '',
		fuel_type_id: 1,
		transmission_id: 1,
		engine_power: 0,
		power_unit_id: 1,
		type_id: 1,
		production_year: new Date().getFullYear(),
		engine_capacity: 0.0,
		mileage: 0.0,
		mileage_in_id: 1,
		value: 0,
		currency_id: 1,
	};

	const handleSubmit = async (
		values: typeof initialFormValues,
		{ resetForm }
	) => {
		try {
			await vehicleMutation.mutateAsync(values);
			resetForm();
			router.push('/vehicles');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='max-w-md mx-auto'>
			<h2 className='text-2xl font-bold mb-4'>Add a new vehicle</h2>
			<Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
				<Form>
					<div className='mb-4'>
						<label
							htmlFor='refuelDate'
							className='block text-gray-700 font-medium mb-2'
						>
							Fueling date
						</label>
						<Field
							type='date'
							id='refuelDate'
							name='refuelDate'
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
						/>
						<ErrorMessage
							name='refuelDate'
							component='div'
							className='text-red-500 mt-2'
						/>
					</div>
					<div className='mb-4'>
						<label
							htmlFor='brand_name'
							className='block text-gray-700 font-medium mb-2'
						>
							Brand
						</label>
						<Field
							type='text'
							id='brand_name'
							name='brand_name'
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
						/>
						<ErrorMessage
							name='brand_name'
							component='div'
							className='text-red-500 mt-2'
						/>
					</div>

					<div className='mb-4'>
						<label
							htmlFor='model_name'
							className='block text-gray-700 font-medium mb-2'
						>
							Model
						</label>
						<Field
							type='text'
							id='model_name'
							name='model_name'
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
						/>
						<ErrorMessage
							name='model_name'
							component='div'
							className='text-red-500 mt-2'
						/>
					</div>

					<div className='mb-4'>
						<label
							htmlFor='fuelType'
							className='block text-gray-700 font-medium mb-2'
						>
							Typ paliwa
						</label>
						<Field
							as='select'
							id='fuelType'
							name='fuelType'
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
						>
							<option value='' disabled>
								Select fuel type
							</option>
							{fuelTypes.map((option) => (
								<option key={option.value} value={option.id}>
									{option.name}
								</option>
							))}
						</Field>
						<ErrorMessage
							name='fuelType'
							component='div'
							className='text-red-500 mt-2'
						/>
					</div>

					<div className='mb-4'>
						<label
							htmlFor='mileage'
							className='block text-gray-700 font-medium mb-2'
						>
							Current mileage
						</label>
						<Field
							type='number'
							id='mileage'
							name='mileage'
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
						/>
						<ErrorMessage
							name='mileage'
							component='div'
							className='text-red-500 mt-2'
						/>
					</div>

					<button
						type='submit'
						className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
					>
						Create
					</button>
					<button className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'>
						<Link href='/vehicles'>Cancel</Link>
					</button>
				</Form>
			</Formik>
		</div>
	);
};

export default NewVehicleForm;
