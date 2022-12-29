import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";

const NewVehicle = () => {
  return (
    <Box>
      <Text fontSize="2xl" mb="2">
        Add New Vehicle
      </Text>
      <Flex flexDir="column" justifyContent="space-between">
        <Box as="form">
          <FormControl>
            <FormLabel htmlFor="brand">Brand</FormLabel>
            <Input type="text" name="brand" id="brand" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="model">Model</FormLabel>
            <Input type="text" name="model" id="model" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="production_year">Production Year</FormLabel>
            <Input type="number" name="production_year" id="production_year" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="engine_capacity">Engine Capacity</FormLabel>
            <Input type="number" name="engine_capacity" id="engine_capacity" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="mileage_in">Mileage In</FormLabel>
            <Input type="number" name="mileage_in" id="mileage_in" />
          </FormControl>

          <Button colorScheme="telegram" variant="outline" my="4">
            Save
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default NewVehicle;
