import { Box, Flex, Heading } from "@chakra-ui/react";
import NewFuelingForm from "../../../../components/fueling/NewFuelingForm";

const NewFuelingPage = ({ vehicleId }: { vehicleId: number }) => {
  return (
    <Box>
      <Flex flexDir="column" justifyContent="space-between">
        <Heading>Add your refueling data for this vehicle</Heading>
        <Box my="4" width="600px" maxWidth="900px" mx="auto">
          <NewFuelingForm vehicleId={vehicleId} />
        </Box>
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
