import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputProps as ChakraNumberInputProps,
  NumberInputStepper,
} from "@chakra-ui/react";

export interface NumberInputProps extends ChakraNumberInputProps {
  name: string;
  label: string;
}

export const NumberInput = (props: NumberInputProps): JSX.Element => {
  return (
    <FormControl id={props.name} isRequired={props.isRequired} mb="2">
      <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      <ChakraNumberInput {...props}>
        <NumberInputField id={props.name} name={props.name} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </ChakraNumberInput>
    </FormControl>
  );
};
