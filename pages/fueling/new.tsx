import { useRouter } from "next/router";
import React from "react";

const NewFueling = () => {
  const [formData, setFormData] = React.useState({
    amount: 0,
    cost: 0,
  });
  const router = useRouter();

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
        {/* date */}
        {/* country */}
        {/* region */}
        {/* station */}
        {/* type of fule */}
        {/* amount per liter */}
        {/* currency */}
        {/* distance traveled */}
        {/* mileage */}
        {/* type of fueling - full or not */}
        {/* tire type */}
        {/* air conditioning */}

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
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.valueAsNumber })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, cost: e.target.valueAsNumber })
            }
            value={formData.cost}
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
