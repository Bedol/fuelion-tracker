import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";

const Navigation = () => {
  return (
    <Box as="section" pb="12">
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container py="4">
          <HStack spacing="10" justify="space-between">
            <Flex justify="space-between" flex="1">
              <ButtonGroup variant="link" spacing="8">
                <Link href="/" passHref>
                  <Button as="a" colorScheme="teal" variant="ghost">
                    Home
                  </Button>
                </Link>
                <Link href="/vehicles" passHref>
                  <Button as="a" colorScheme="teal" variant="ghost">
                    Your Vehicles
                  </Button>
                </Link>
                <Link href="/auth/signin" passHref>
                  <Button as="a" colorScheme="teal" variant="ghost">
                    Sign In
                  </Button>
                </Link>
              </ButtonGroup>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Navigation;
