import useSWR from "swr";

const AllVehicles = () => {
  const { data, error } = useSWR("/api/vehicles");
  if (error) return <div>An error occured.</div>;
  if (!data) return <div>Loading ...</div>;

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
