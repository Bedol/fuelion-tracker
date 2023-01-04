import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";
import { Fueling } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { useMutation } from "react-query";
import Card from "../Card";

const NewFuelingForm = ({ vehicleId }: { vehicleId: number }) => {
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
      })
  );

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
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await refuelMutation.mutate(values);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
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

              <FormControl mb="2">
                <FormLabel htmlFor="country">Country</FormLabel>
                <Field
                  as={Select}
                  placeholder="Select country"
                  name="country"
                  id="country"
                >
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Austria">Austria</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Norway">Norway</option>
                  <option value="Finland">Finland</option>
                  <option value="Iceland">Iceland</option>
                  <option value="Poland">Poland</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Bosnia and Herzegovina">
                    Bosnia and Herzegovina
                  </option>
                  <option value="Serbia">Serbia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Albania">Albania</option>
                  <option value="Macedonia">Macedonia</option>
                  <option value="Greece">Greece</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Romania">Romania</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Russia">Russia</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Ireland">Ireland</option>
                </Field>
              </FormControl>

              <FormControl mb="2">
                <FormLabel htmlFor="region">Region</FormLabel>
                <Field as={Input} type="text" name="region" id="region" />
              </FormControl>

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

              <Button
                type="submit"
                colorScheme="telegram"
                variant="outline"
                my="4"
                disabled={isSubmitting}
              >
                Add
              </Button>
            </Form>
          </Box>
        )}
      </Formik>
    </Card>
  );
};

export default NewFuelingForm;
