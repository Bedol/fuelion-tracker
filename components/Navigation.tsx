import NavigationItem from "./NavigationItem";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto sm:py-2">
        <div className="sm:flex justify-around">
          <div className="text-white">
            <Link href="#">
              <a className="text-3xl font-bold">Fuelion</a>
            </Link>
          </div>
          <ul className="text-gray-400 text-xl sm:flex sm:flex-wrap sm:self-center border-t sm:border-none">
            <NavigationItem name="Add Refueling" path="#" />
            <NavigationItem name="Add Expense" path="#" />
            <NavigationItem name="Your Vehicles" path="#" />
            <NavigationItem name="Profile" path="#" />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
