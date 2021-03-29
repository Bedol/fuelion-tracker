import NavigationItem from "./NavigationItem";
import Link from "next/link";

const Navigation = () => {
  return (
    <header>
      <nav className="bg-gray-800 shadow-lg">
        <div className="container mx-auto sm:py-2">
          <div className="sm:flex items-center justify-between p-5">
            <div className="text-white">
              <Link href="/">
                <a className="text-3xl font-bold">Fuelion</a>
              </Link>
            </div>
            <ul className="text-gray-400 text-xl sm:flex sm:flex-wrap sm:self-center">
              <NavigationItem name="Add Refueling" path="/fueling/new" />
              <NavigationItem name="Add Expense" path="/expenses/new" />
              <NavigationItem name="Your Vehicles" path="/vehicles" />
              <NavigationItem name="Profile" path="/profiles" />
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
