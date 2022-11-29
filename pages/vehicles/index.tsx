import { useQuery } from "react-query";

const AllVehicles = () => {
  const { isLoading, isError, data } = useQuery("vehicles", async () => {
    const result = await fetch("/api/vehicles");
    return result.json();
  });

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>An error occurred.</div>;

  return (
    <div>
      <h1>Your Vehicles list</h1>
      <ul>
        {data.map((vehicle) => (
          <li key={vehicle.id}>{vehicle.brand}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllVehicles;
