import { Alert, AlertIcon, Center } from "@chakra-ui/react";

const FetchDataErrorAlert = ({ errorMessage }) => {
  return (
    <Center>
      <Alert status="error">
        <AlertIcon />
        {errorMessage}
      </Alert>
    </Center>
  );
};

export default FetchDataErrorAlert;
