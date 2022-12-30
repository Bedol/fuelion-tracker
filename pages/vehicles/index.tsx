import {
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";

const AllVehicles = () => {
  const { isLoading, isError, data } = useQuery("vehicles", async () => {
    const result = await fetch("/api/vehicles");
    return result.json();
  });

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>An error occurred.</div>;

  return (
    <Flex direction="column" justifyContent="center">
      <Heading>Your Vehicles list</Heading>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <Thead>
            <Tr>
              <Th>Brand</Th>
              <Th align="right">Model</Th>
              <Th align="right">Mileage</Th>
              <Th align="right">Fuel Type</Th>
              <Th align="right">Production Year</Th>
              <Th align="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row) => (
              <Tr key={row.id}>
                <Td scope="row">{row.brand}</Td>
                <Td align="right">{row.model}</Td>
                <Td align="right">{row.mileage}</Td>
                <Td align="right">{row.fuel_type}</Td>
                <Td align="right">{row.production_year}</Td>
                <Td align="right">
                  <Link href={`/vehicles/${row.id}`} passHref>
                    <Button as="a" colorScheme="facebook" variant="ghost">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/vehicles/${row.id}/fueling/new`} passHref>
                    <Button as="a" colorScheme="facebook" variant="ghost">
                      Add fueling
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Link href="/vehicles/new" passHref>
        <Button as="a" colorScheme="facebook" variant="ghost">
          Add new vehicle
        </Button>
      </Link>
    </Flex>
  );
};

export default AllVehicles;
