import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { Vehicle } from '@prisma/client';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useMutation } from 'react-query';
import { CurrencyType, SelectOptionType, fuelTypes, currencies } from '../../types/vehicle_types';

const powerUnits: SelectOptionType[] = [
  { id: 1, name: 'Horese Power', value: 'HP' },
  { id: 2, name: 'Kilo Wats', value: 'kW' }
]

const vehicleTypes: SelectOptionType[] = [
  { id: 1, name: 'Car', value: 'CAR' },
  { id: 2, name: 'Truck', value: 'TRUCK' },
  { id: 3, name: 'Motorcycle', value: 'MOTORCYCLE' },
]

// TODO: move this type to global types
const mileageUnits: SelectOptionType[] = [
  { id: 1, name: 'Kilometers', value: 'KM' },
  { id: 2, name: 'Miles', value: 'MIL' }
]


// TODO: Convert whole form to new component
const NewVehicleForm = () => {
  const vehicleMutation = useMutation(
    (values: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) =>
      fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
  );

  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return <p>You need to signin first</p>
  }

  const formik = useFormik({
    initialValues: {
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
      currency_id: 1
    },
    onSubmit: (values, actions) => {
      vehicleMutation.mutate(values);
      actions.setSubmitting(false);
      actions.resetForm();
    },
  });

  return (
    <Box>
      <Text fontSize='2xl' mb='2'>
        Add New Vehicle
      </Text>
      <Flex flexDir='column' justifyContent='space-between'>
        <form onSubmit={formik.handleSubmit}>
          <FormControl isRequired>
            <FormLabel htmlFor='type_id'>Vehicle type</FormLabel>
            <Select name='type_id' id='type_id' placeholder='Choose option' onChange={formik.handleChange} value={formik.values.type_id}>
              {vehicleTypes.map((type) =>
                <option key={type.id} value={type.id}>{type.name}</option>
              )}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor='brand_name'>Brand name</FormLabel>
            <Input
              type='text'
              name='brand_name'
              id='brand_name'
              onChange={formik.handleChange}
              value={formik.values.brand_name}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor='model_name'>Model name</FormLabel>
            <Input
              type='text'
              name='model_name'
              id='model_name'
              onChange={formik.handleChange}
              value={formik.values.model_name}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='production_year'>Production Year</FormLabel>
            <Input
              type='number'
              name='production_year'
              id='production_year'
              onChange={formik.handleChange}
              value={formik.values.production_year}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='engine_capacity'>Engine Capacity</FormLabel>
            <Input
              type='number'
              name='engine_capacity'
              id='engine_capacity'
              onChange={formik.handleChange}
              value={formik.values.engine_capacity}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='engine_power'>Power</FormLabel>
            <Input
              type='number'
              name='engine_power'
              id='engine_power'
              onChange={formik.handleChange}
              value={formik.values.engine_power}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='power_unit_id'>Power Unit</FormLabel>
            <Select name='power_unit_id' id='power_unit_id' placeholder='Choose option' onChange={formik.handleChange} value={formik.values.power_unit_id}>
              {powerUnits.map((unit) =>
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              )}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor='fuel_type_id'>Fuel type</FormLabel>
            <Select name='fuel_type_id' id='fuel_type_id' placeholder='Choose option' onChange={formik.handleChange} value={formik.values.fuel_type_id}>
              {fuelTypes.map((fuel_type) =>
                <option key={fuel_type.id} value={fuel_type.id}>{fuel_type.name}</option>
              )}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor='mileage'>Mileage</FormLabel>
            <Input
              type='number'
              name='mileage'
              id='mileage'
              onChange={formik.handleChange}
              value={formik.values.mileage}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='mileage_in_id'>Mileage units</FormLabel>
            <Select name='mileage_in_id' id='mileage_in_id' placeholder='Choose option' onChange={formik.handleChange} value={formik.values.mileage_in_id}>
              {mileageUnits.map((unit) =>
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              )}
            </Select>
          </FormControl>


          <FormControl>
            <FormLabel htmlFor='value'>Purchase cost</FormLabel>
            <Input
              type='number'
              name='value'
              id='value'
              onChange={formik.handleChange}
              value={formik.values.value}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='currency_id'>Purchase currency</FormLabel>
            <Select name='currency_id' id='currency_id' placeholder='Choose option' onChange={formik.handleChange} value={formik.values.currency_id}>
              {currencies.map((currency) =>
                <option key={currency.id} value={currency.id}>{currency.name}</option>
              )}
            </Select>
          </FormControl>


          <Button
            type='submit'
            colorScheme='telegram'
            variant='outline'
            my='4'
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Flex>
    </Box>
  );
};

export default NewVehicleForm;

