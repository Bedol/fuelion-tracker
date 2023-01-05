import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
} from "@chakra-ui/react";
import { Fueling } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { getCountries } from "../../hooks/getCountries";
import { getStates } from "../../hooks/getStates";
import Card from "../Card";

const getStatesForCountry = (countryCode: string) => {
  return getStates(countryCode).map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));
};

type NewFuelingFormProps = {
  vehicleId: number;
};

const NewFuelingForm = ({ vehicleId }: NewFuelingFormProps) => {
  const router = useRouter();
  const backToVehicles = () => {
    router.push("/vehicles");
  };
  const toast = useToast({
    duration: 5000,
    isClosable: true,
    containerStyle: {
      zIndex: 999,
      marginTop: "5rem",
    },
  });
  const refuelMutation = useMutation(
    (
      values: Omit<
        Fueling,
        | "id"
        | "created_at"
        | "updated_at"
        | "type_of_fueling"
        | "type_of_fuel"
        | "tire_type"
        | "air_conditioning"
      >
    ) =>
      fetch("/api/fueling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    {
      onSuccess: () => {
        toast({
          title: "Fueling added.",
          position: "top-right",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "An error occurred.",
          position: "top-right",
          status: "error",
        });
      },
    }
  );
  const { data: countries } = useQuery("countries", async () => {
    const result = await getCountries();
    return result.map((country) => ({
      label: country.name,
      value: country.iso2,
    }));
  });

  return (
    <Card>
      <Formik
        initialValues={{
          amount: 0.0,
          cost: 0.0,
          date: new Date(Date.now()),
          country: "",
          region: "",
          station: "",
          currency: "",
          distance_traveled: 0.0,
          mileage: 0.0,
          vehicleId,
        }}
        onSubmit={async (values) => {
          await refuelMutation.mutate(values);
        }}
      >
        {() => (
          <Box py="12px" px="32px">
            <Form>
              <Field name="amount">
                {({ field, form }) => (
                  <FormControl id="amount" isRequired mb="2">
                    <FormLabel htmlFor="amount">Amount of fuel</FormLabel>
                    <NumberInput
                      onChange={(val) =>
                        form.setFieldValue(field.name, parseFloat(val))
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField id="amount" name="amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </Field>

              <Field name="cost">
                {({ field, form }) => (
                  <FormControl id="cost" isRequired mb="2">
                    <FormLabel htmlFor="cost">Cost of fuel</FormLabel>
                    <NumberInput
                      onChange={(val) =>
                        form.setFieldValue(field.name, parseFloat(val))
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </Field>

              <FormControl mb="2" isRequired>
                <FormLabel htmlFor="country">Country</FormLabel>
                <Field
                  as={Select}
                  placeholder="Select country"
                  name="country"
                  id="country"
                >
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </Field>
              </FormControl>

              <Field name="region">
                {({ form }) => (
                  <FormControl id="region" isRequired mb="2">
                    <FormLabel htmlFor="region">Region</FormLabel>
                    <Select
                      id="region"
                      name="region"
                      placeholder="Choose region"
                      disabled={!form.values.country}
                    >
                      {getStatesForCountry(form.values.country).map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Field>

              <FormControl mb="2">
                <FormLabel htmlFor="station">Station</FormLabel>
                <Field
                  as={Select}
                  placeholder="Select station"
                  name="station"
                  id="station"
                >
                  <option value="Shell">Shell</option>
                  <option value="Esso">Esso</option>
                  <option value="Total">Total</option>
                  <option value="BP">BP</option>
                  <option value="Aral">Aral</option>
                  <option value="Agip">Agip</option>
                  <option value="OMV">OMV</option>
                  <option value="Q8">Q8</option>
                  <option value="Texaco">Texaco</option>
                  <option value="Mobil">Mobil</option>
                  <option value="Statoil">Statoil</option>
                  <option value="Orlen">Orlen</option>
                  <option value="Gulf">Gulf</option>
                  <option value="Moya">Moya</option>
                  <option value="Lotos">Lotos</option>
                </Field>
              </FormControl>

              <FormControl isRequired mb="2">
                <FormLabel htmlFor="currency">Currency</FormLabel>
                <Field
                  as={Select}
                  placeholder="Select currency"
                  name="currency"
                  id="currency"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="PLN">PLN</option>
                  <option value="CZK">CZK</option>
                  <option value="NOK">NOK</option>
                </Field>
              </FormControl>

              <Field name="distance_traveled">
                {({ field, form }) => (
                  <FormControl id="distance_traveled" isRequired mb="2">
                    <FormLabel htmlFor="distance_traveled">
                      Distance traveled
                    </FormLabel>
                    <NumberInput
                      onChange={(val) =>
                        form.setFieldValue(field.name, parseFloat(val))
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField
                        id="distance_traveled"
                        name="distance_traveled"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </Field>

              <Field name="mileage">
                {({ field, form }) => (
                  <FormControl id="mileage" isRequired mb="2">
                    <FormLabel htmlFor="distance_traveled">Mileage</FormLabel>
                    <NumberInput
                      onChange={(val) =>
                        form.setFieldValue(field.name, parseFloat(val))
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </Field>

              <ButtonGroup mt="2" variant="outline">
                <Button
                  type="submit"
                  colorScheme="telegram"
                  isLoading={refuelMutation.isLoading}
                  loadingText="Submitting"
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
