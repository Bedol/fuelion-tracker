import { useRouter } from "next/router";
import React from "react";

const NewFueling = () => {
  const [formData, setFormData] = React.useState({
    amount: 0.0,
    cost: 0.0,
    date: new Date(Date.now()),
    country: "",
    region: "",
    station: "",
    currency: "",
    distance_traveled: 0.0,
    mileage: 0.0,
  });
  const router = useRouter();

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const { name, value, valueAsNumber, type } = e.target;

    if (type === "number") {
      return setFormData({ ...formData, [name]: valueAsNumber });
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      await fetch("/api/fueling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await router.push("/fueling/new");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="px-2 py-4">
      <h2 className="mb-6">Add your fuel cost</h2>

      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Amount of fuel
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.amount}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cost of fuel
          </label>
          <input
            type="number"
            name="cost"
            id="cost"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.cost}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Country
          </label>
          <input
            type="text"
            name="country"
            id="country"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.country}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Region
          </label>
          <input
            type="text"
            name="region"
            id="region"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.region}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Station
          </label>
          <input
            type="text"
            name="station"
            id="station"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.station}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Currency
          </label>
          <input
            type="text"
            name="currency"
            id="currency"
            max={3}
            min={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.currency}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Distance traveled
          </label>
          <input
            type="number"
            name="distance_traveled"
            id="distance_traveled"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.distance_traveled}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mileage
          </label>
          <input
            type="number"
            name="mileage"
            id="mileage"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => handleChange(e)}
            value={formData.mileage}
          />
        </div>

        <input
          type="submit"
          value="Add"
          className="input-submit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

export default NewFueling;
