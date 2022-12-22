import Navigation from "./Navigation";
import { Flex, Container } from "@chakra-ui/react";
import React from "react";

const Layout = ({ children }) => {
  return (
    <Flex flexDirection="column" flex="1">
      <Navigation />
      <Flex as="main" role="main" direction="column" flex="1" py="sm">
        <Container flex="1">
          {children}
        </Container>
      </Flex>
    </Flex>
  );
};

export default Layout;
