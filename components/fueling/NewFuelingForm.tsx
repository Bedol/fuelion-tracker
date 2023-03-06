import {
	Box,
	Button,
	ButtonGroup,
	FormControl,
	FormLabel,
	Select,
	Switch,
	useToast,
} from '@chakra-ui/react';
import { Fueling, Vehicles } from '@prisma/client';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'react-query';
import { getCountries } from '../../hooks/getCountries';
import { getStates } from '../../hooks/getStates';
import Card from '../Card';
import { NumberInput } from '../Form/NumberInput';

const getStatesForCountry = (countryCode: string) => {
	return getStates(countryCode).map((state) => ({
		label: state.name,
		value: state.isoCode,
	}));
};

export type NewFuelingFormProps = {
	vehicle: Vehicles;
};

const NewFuelingForm = ({ vehicle }: NewFuelingFormProps) => {
	const router = useRouter();
	const backToVehicles = () => {
		router.push('/vehicles');
	};
	const toast = useToast({
		duration: 5000,
		isClosable: true,
		containerStyle: {
			zIndex: 999,
			marginTop: '5rem',
		},
	});
	const refuelMutation = useMutation(
		(
			values: Omit<
				Fueling,
				| 'id'
				| 'created_at'
				| 'updated_at'
				| 'type_of_fueling'
				| 'type_of_fuel'
				| 'tire_type'
			>
		) =>
			fetch('/api/fueling', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			}),
		{
			onSuccess: () => {
				toast({
					title: 'Fueling added.',
					position: 'top-right',
					status: 'success',
				});
			},
			onError: () => {
				toast({
					title: 'An error occurred.',
					position: 'top-right',
					status: 'error',
				});
			},
		}
	);

	const countries = React.useMemo(() => {
		return getCountries().map((country) => ({
			label: country.name,
			value: country.iso2,
		}));
	}, []);

	const [states, setStates] = React.useState<
		{ label: string; value: string }[]
	>([]);

	return (
		<Card>
			<Formik
				initialValues={{
					amount: 0.0,
					cost: 0.0,
					date: new Date(Date.now()),
					country: '',
					region: '',
					station: '',
					currency: '',
					distance_traveled: 0,
					mileage: vehicle.mileage,
					air_conditioning: true,
					vehicleId: vehicle.id,
				}}
				onSubmit={async (values) => {
					await refuelMutation.mutate(values);
				}}
			>
				{() => (
					<Box py='12px' px='32px'>
						<Form>
							<Field name='amount'>
								{({ field, form }) => (
									<NumberInput
										isRequired
										name='amount'
										label='Amount of fuel'
										onChange={(val) =>
											form.setFieldValue(field.name, parseFloat(val))
										}
										min={0}
										precision={2}
									/>
								)}
							</Field>

							<Field name='cost'>
								{({ field, form }) => (
									<NumberInput
										isRequired
										name='cost'
										label='Cost of fuel'
										onChange={(val) =>
											form.setFieldValue(field.name, parseFloat(val))
										}
										min={0}
										precision={2}
									/>
								)}
							</Field>

							<Field name='country'>
								{({ form }) => (
									<FormControl id='country' isRequired mb='2'>
										<FormLabel htmlFor='country'>Country</FormLabel>
										<Select
											id='country'
											name='country'
											placeholder='Select country'
											onChange={(e) => {
												form.setFieldValue('country', e.target.value);
												setStates(getStatesForCountry(e.target.value));
											}}
										>
											{countries.map((country) => (
												<option key={country.value} value={country.value}>
													{country.label}
												</option>
											))}
										</Select>
									</FormControl>
								)}
							</Field>

							<Field name='region'>
								{({ form }) => (
									<FormControl id='region' isRequired mb='2'>
										<FormLabel htmlFor='region'>Region</FormLabel>
										<Select
											id='region'
											name='region'
											placeholder='Choose region'
											disabled={!form.values.country}
										>
											{states.map((state) => (
												<option key={state.value} value={state.value}>
													{state.label}
												</option>
											))}
										</Select>
									</FormControl>
								)}
							</Field>

							<FormControl mb='2'>
								<FormLabel htmlFor='station'>Station</FormLabel>
								<Field
									as={Select}
									placeholder='Select station'
									name='station'
									id='station'
								>
									<option value='Shell'>Shell</option>
									<option value='Esso'>Esso</option>
									<option value='Total'>Total</option>
									<option value='BP'>BP</option>
									<option value='Aral'>Aral</option>
									<option value='Agip'>Agip</option>
									<option value='OMV'>OMV</option>
									<option value='Q8'>Q8</option>
									<option value='Texaco'>Texaco</option>
									<option value='Mobil'>Mobil</option>
									<option value='Statoil'>Statoil</option>
									<option value='Orlen'>Orlen</option>
									<option value='Gulf'>Gulf</option>
									<option value='Moya'>Moya</option>
									<option value='Lotos'>Lotos</option>
								</Field>
							</FormControl>

							<FormControl isRequired mb='2'>
								<FormLabel htmlFor='currency'>Currency</FormLabel>
								<Field
									as={Select}
									placeholder='Select currency'
									name='currency'
									id='currency'
								>
									<option value='EUR'>EUR</option>
									<option value='USD'>USD</option>
									<option value='GBP'>GBP</option>
									<option value='PLN'>PLN</option>
									<option value='CZK'>CZK</option>
									<option value='NOK'>NOK</option>
								</Field>
							</FormControl>

							<Field name='distance_traveled'>
								{({ field, form }) => (
									<NumberInput
										name='distance_traveled'
										label='Distance traveled'
										onChange={(val) => {
											form.setFieldValue(field.name, parseInt(val));
											form.setFieldValue(
												'mileage',
												vehicle.mileage + form.values.distance_traveled
											);
										}}
										min={0}
										value={form.values.distance_traveled}
									/>
								)}
							</Field>

							<Field name='mileage'>
								{({ field, form }) => (
									<NumberInput
										isRequired
										name='mileage'
										label='Mileage'
										onChange={(val) => {
											form.setFieldValue(field.name, parseInt(val));
											form.setFieldValue(
												'distance_traveled',
												form.values.mileage - vehicle.mileage
											);
										}}
										value={form.values.mileage}
										min={vehicle.mileage}
									/>
								)}
							</Field>

							<FormControl mb='2'>
								<FormLabel htmlFor='air_conditioning'>
									Air conditioning ?
								</FormLabel>
								<Switch name='air_conditioning' id='air_conditioning' />
							</FormControl>

							<ButtonGroup mt='2' variant='outline'>
								<Button
									type='submit'
									colorScheme='telegram'
									isLoading={refuelMutation.isLoading}
									loadingText='Submitting'
								>
									Submit
								</Button>
								<Button onClick={backToVehicles}>Back</Button>
							</ButtonGroup>
						</Form>
					</Box>
				)}
			</Formik>
		</Card>
	);
};

export default NewFuelingForm;
