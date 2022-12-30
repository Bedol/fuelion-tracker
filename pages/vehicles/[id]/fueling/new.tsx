import { Box, Flex } from "@chakra-ui/react";
import Form from "../../../../components/fueling/form";

const NewFuelingPage = ({ vehicleId }: { vehicleId: number }) => {
  return (
    <Box>
      <Flex flexDir="column" justifyContent="space-between">
        <Box
          as="h2"
          fontSize="2xl"
          fontWeight="semibold"
          lineHeight="10"
          mb="6"
        >
          Add your fuel cost
        </Box>

        <Form vehicleId={vehicleId} />
      </Flex>
    </Box>
  );
};

export default NewFuelingPage;

export async function getServerSideProps(context) {
  const { id } = context.params;
  const vehicleId = parseInt(id);

  return {
    props: {
      vehicleId,
    },
  };
}
