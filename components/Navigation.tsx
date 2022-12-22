import Link from "next/link";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'

const Navigation = () => {
  return (
    <Box as="section" pb="12">
      <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
        <Container py="4">
          <HStack spacing="10" justify="space-between">
            <Flex justify="space-between" flex="1">
              <ButtonGroup variant="link" spacing="8">
                <Link href="/fueling/new" passHref>
                  <Button as="a" colorScheme="teal" variant="ghost">Add Refueling</Button>
                </Link>
                <Link href="/expenses/new" passHref>
                  <Button as="a" colorScheme="teal" variant="ghost">Add Expenses</Button>
                </Link>
                <Link href="/vehicles" passHref>
                  <Button as="a" colorScheme="teal" variant="ghost">Your Vehicles</Button>
                </Link>
                <Link href="/profiles" passHref>
                  <Button as="a" colorScheme="teal" variant="ghost">Profiles</Button>
                </Link>
              </ButtonGroup>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>)
};

export default Navigation;
