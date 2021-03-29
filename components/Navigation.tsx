import NavigationItem from "./NavigationItem";
import Link from "next/link";

const Navigation = () => {
  return (
    <header className="border-b md:flex md:items-center justify-around p-4 bg-gray-800">
      <div className="flex items-center justify-between mb-4 md:mb-0">
        <h1 className="leading-none text-3xl text-white hover:text-gray-200">
          <Link href="/">
            <a className="no-underline">Fuelion</a>
          </Link>
        </h1>
      </div>

      <nav className="">
        <ul className="list-reset md:flex md:items-center">
          <NavigationItem name="Add Refueling" path="/fueling/new" />
          <NavigationItem name="Add Expense" path="/expenses/new" />
          <NavigationItem name="Your Vehicles" path="/vehicles" />
          <NavigationItem name="Profile" path="/profiles" />
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
