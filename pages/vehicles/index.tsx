import { AddIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Vehicle } from '@prisma/client';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next/types';
import { FaChartBar, FaGasPump } from 'react-icons/fa';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import FetchDataErrorAlert from '../../components/errors/FetchDataErrorAlert';
import Loading from '../../components/Loading';
import { getCountries } from '../../hooks/getCountries';
import { fuelTypes } from '../../types/vehicle_types';

const AllVehicles = () => {
  const { isLoading, isError, data } = useQuery('vehicles', async () => {
    const result = await fetch('/api/vehicles');
    return result.json();
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <FetchDataErrorAlert errorMessage='An error occurred while fetching vehicles.' />
    );

  const getFuelTypeName = (fuelTypeId: number): string => {
    let typeObj = fuelTypes.find(fuelType => fuelType.id === fuelTypeId)
    if (typeObj) {
      return typeObj.name
    }
    return ""
  }

  return (
    <Flex direction='column' justifyContent='center'>
      <Flex justifyContent='space-between' alignItems='baseline' mb='3'>
        <Heading>Your Vehicles list</Heading>
        <Button
          as={NextLink}
          href='/vehicles/new'
          colorScheme='facebook'
          variant='outline'
          leftIcon={<AddIcon />}
        >
          Add vehicle
        </Button>
      </Flex>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <Thead>
            <Tr>
              <Th>Brand</Th>
              <Th align='right'>Model</Th>
              <Th align='right'>Mileage</Th>
              <Th align='right'>Fuel Type</Th>
              <Th align='right'>Production Year</Th>
              <Th align='right'>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row: Vehicle) => (
              <Tr key={row.id}>
                <Td scope='row'>{row.brand_name}</Td>
                <Td align='right'>{row.model_name}</Td>
                <Td align='right'>{row.mileage}</Td>
                <Td align='right'>{getFuelTypeName(row.fuel_type_id)}</Td>
                <Td align='right'>{row.production_year}</Td>
                <Td align='right'>
                  <ButtonGroup variant='outline'>
                    <IconButton
                      as={NextLink}
                      href={`/vehicles/${row.id}/edit`}
                      aria-label='Edit vehicle'
                      colorScheme='yellow'
                      icon={<EditIcon />}
                    />
                    <IconButton
                      as={NextLink}
                      href={`/vehicles/${row.id}/fueling/new`}
                      aria-label='Add fueling'
                      colorScheme='green'
                      icon={<FaGasPump />}
                    />
                    <IconButton
                      as={NextLink}
                      href={`/vehicles/${row.id}/statistics`}
                      aria-label='Statistics'
                      colorScheme='blue'
                      icon={<FaChartBar />}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default AllVehicles;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const { DOMAIN_URL } = process.env;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('countries', async () => {
    const result = getCountries();
    return result;
  });

  await queryClient.prefetchQuery('vehicles', async () => {
    const result = await fetch(`${DOMAIN_URL}/api/vehicles`);
    return result.json();
  });


  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
