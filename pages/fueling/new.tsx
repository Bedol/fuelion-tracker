import { useRouter } from "next/router";
import React from "react";

const NewFueling = () => {
  const [amount, setAmount] = React.useState(0);
  const [cost, setCost] = React.useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { amount, cost };

    try {
      await fetch("/api/fueling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await router.push("/fueling/new");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Add your fuel cost</h2>

      <form>
        {/* data */}
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

        <label htmlFor="amount">Amount of fuel</label>
        <input
          type="number"
          name="amount"
          id="amount"
          onChange={(e) => {
            setAmount(e.target.valueAsNumber);
          }}
          value={amount}
        />

        <label htmlFor="cost">Cost of fuel</label>
        <input
          type="number"
          name="cost"
          id="cost"
          onChange={(e) => setCost(e.target.valueAsNumber)}
          value={cost}
        />

        <input type="submit" value="Add" onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default NewFueling;
