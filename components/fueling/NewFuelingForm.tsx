import {
	Box,
	Button,
	ButtonGroup,
	FormControl,
	Input,
	FormLabel,
	Select,
	SimpleGrid,
	Switch,
	useToast,
} from '@chakra-ui/react';
import { Fueling, Vehicle } from '@prisma/client';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { getCountries } from '../../hooks/getCountries';
import { getStates } from '../../hooks/getStates';
import { fuelTypes, currencies } from '../../types/vehicle_types';
import Card from '../Card';
import { NumberInput } from '../Form/NumberInput';
import { SliderThumbWithTooltip } from '../Form/SliderThumbWithTooltip';
import { gasStations } from './data/dictionary';

const getStatesForCountry = (countryCode: string) => {
	return getStates(countryCode).map((state) => ({
		label: state.name,
		value: state.isoCode,
	}));
};

export type NewFuelingFormProps = {
	vehicle: Vehicle;
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
	const refuelMutation = useMutation({
		mutationFn: (values: Omit<Fueling, 'id' | 'created_at' | 'updated_at' | 'tire_type'>) =>
			fetch('/api/fueling', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			}),
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
		}
	});

	const countries = React.useMemo(() => {
		return getCountries().map((country) => ({
			label: country.name,
			value: country.iso2,
		}));
	}, []);

	const [states, setStates] = React.useState<
		{ label: string; value: string }[]
	>([]);

	// TODO: use formik hook instead Formik component
	return (
		<Card>
			<Formik
				initialValues={{
					quantity: 0.0,
					cost: 0.0,
					cost_per_unit: 0.0,
					date: new Date(Date.now()),
					country: '',
					region: '',
					station: '',
					currency_id: null,
					fuel_type_id: null,
					full_tank: true,
					distance_traveled: 0.0,
					mileage: vehicle.mileage,
					air_conditioning: true,
					air_conditioning_value: 100,
					vehicle_id: vehicle.id,
				}}
				onSubmit={(values) => {
					// TODO: Add validation
					console.log(values, 'form values');
					// refuelMutation.mutate(values);
				}}
			>
				{() => (
					<Box py='12px' px='32px'>
						<Form>
							<SimpleGrid columns={2} spacing={2}>
								<FormControl mb='2'>
									<FormLabel htmlFor='date'>Date</FormLabel>
									<Input placeholder='Select Date' type='date' name='date' />
								</FormControl>

								<Field name='quantity'>
									{({ field, form }) => (
										<NumberInput
											isRequired
											name='quantity'
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

								<Field name='cost_per_unit'>
									{({ field, form }) => (
										<NumberInput
											isRequired
											name='cost_per_unit'
											label='Cost per unit'
											onChange={(val) =>
												form.setFieldValue(field.name, parseFloat(val))
											}
											min={0}
											precision={2}
										/>
									)}
								</Field>

								<FormControl isRequired>
									<FormLabel htmlFor='fuel_type_id'>Fuel type</FormLabel>
									<Select
										name='fuel_type_id'
										id='fuel_type_id'
										placeholder='Choose option'
									>
										{fuelTypes.map((fuel_type) => (
											<option key={fuel_type.id} value={fuel_type.id}>
												{fuel_type.name}
											</option>
										))}
									</Select>
								</FormControl>

								<Field>
									{({ form }) => (
										<FormControl mb='2'>
											<FormLabel htmlFor='full_tank'>Full tank?</FormLabel>
											<Switch
												name='full_tank'
												id='full_tank'
												isChecked={form.values.full_tank}
											/>
										</FormControl>
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
										{gasStations.map((station) => (
											<option key={station.value} value={station.value}>
												{station.label}
											</option>
										))}
									</Field>
								</FormControl>

								<FormControl>
									<FormLabel htmlFor='currency_id'>Currency</FormLabel>
									<Select
										name='currency_id'
										id='currency_id'
										placeholder='Choose option'
									>
										{currencies.map((currency) => (
											<option key={currency.id} value={currency.id}>
												{currency.name}
											</option>
										))}
									</Select>
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
							</SimpleGrid>

							<Field>
								{() => (
									<FormControl mb='2'>
										<FormLabel htmlFor='air_conditioning'>
											Air Conditioning
										</FormLabel>
										<Switch name='air_conditioning' id='air_conditioning' />
									</FormControl>
								)}
							</Field>

							<FormControl mb='2'>
								<SliderThumbWithTooltip
									defaultValue={100}
									name='air_conditioning_value'
								/>
							</FormControl>

							<ButtonGroup mt='2' variant='outline'>
								<Button
									type='submit'
									colorScheme='telegram'
									isLoading={refuelMutation.isPending}
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
