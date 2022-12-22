import { useRouter } from "next/router";
import { Button, Box, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

const NewFueling = () => {
  const [formData, setFormData] = React.useState({
    amount: 0.0,
    cost: 0.0,
    date: new Date(Date.now()),
    country: "",
    region: "",
    station: "",
    currency: "",
    distance_traveled: 0.0,
    mileage: 0.0,
  });
  const router = useRouter();

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const { name, value, valueAsNumber, type } = e.target;

    if (type === "number") {
      return setFormData({ ...formData, [name]: valueAsNumber });
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      await fetch("/api/fueling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await router.push("/fueling/new");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Flex flexDir="column" justifyContent="space-between">
        <Box as="h2" fontSize="2xl" fontWeight="semibold" lineHeight="10" mb="6">Add your fuel cost</Box>
        <Box as="form">
          <FormControl>
            <FormLabel
              htmlFor="amount"
            >
              Amount of fuel
            </FormLabel>
            <Input
              type="number"
              name="amount"
              id="amount"
              onChange={(e) => handleChange(e)}
              value={formData.amount}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="cost"
            >
              Cost of fuel
            </FormLabel>
            <Input
              type="number"
              name="cost"
              id="cost"
              onChange={(e) => handleChange(e)}
              value={formData.cost}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="cost"
            >
              Country
            </FormLabel>
            <Input
              type="text"
              name="country"
              id="country"
              onChange={(e) => handleChange(e)}
              value={formData.country}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="cost"
            >
              Region
            </FormLabel>
            <Input
              type="text"
              name="region"
              id="region"
              onChange={(e) => handleChange(e)}
              value={formData.region}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="cost"
            >
              Station
            </FormLabel>
            <Input
              type="text"
              name="station"
              id="station"
              onChange={(e) => handleChange(e)}
              value={formData.station}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="cost"
            >
              Currency
            </FormLabel>
            <Input
              type="text"
              name="currency"
              id="currency"
              max={3}
              min={3}
              onChange={(e) => handleChange(e)}
              value={formData.currency}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="cost"
            >
              Distance traveled
            </FormLabel>
            <Input
              type="number"
              name="distance_traveled"
              id="distance_traveled"
              onChange={(e) => handleChange(e)}
              value={formData.distance_traveled}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="cost"
            >
              Mileage
            </FormLabel>
            <Input
              type="number"
              name="mileage"
              id="mileage"
              onChange={(e) => handleChange(e)}
              value={formData.mileage}
            />
          </FormControl>

          <Button onClick={handleSubmit} colorScheme="telegram" variant="outline" my="4">Add</Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default NewFueling;
