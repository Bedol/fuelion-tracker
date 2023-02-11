import { Box, Flex, Heading } from "@chakra-ui/react";
import { PrismaClient } from "@prisma/client";
import NewFuelingForm, {
  NewFuelingFormProps,
} from "../../../../components/fueling/NewFuelingForm";

const NewFuelingPage = ({ vehicle }: NewFuelingFormProps) => {
  return (
    <Box>
      <Flex flexDir="column" justifyContent="space-between">
        <Heading>Add your refueling data for this vehicle</Heading>
        <Box my="4" width="600px" maxWidth="900px" mx="auto">
          <NewFuelingForm vehicle={vehicle} />
        </Box>
      </Flex>
    </Box>
  );
};

export default NewFuelingPage;

export async function getServerSideProps(context) {
  const { id } = context.params;
  const vehicleId = parseInt(id);

  const prisma = new PrismaClient();
  const vehicle = await prisma.vehicles.findUnique({
    where: {
      id: vehicleId,
    },
  });

  return {
    props: {
      vehicle,
    },
  };
}
