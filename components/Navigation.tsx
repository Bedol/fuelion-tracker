import NavigationItem from "./NavigationItem";

const Sidebar = () => {
  return (
    <nav>
      <ul className="list-reset">
        <NavigationItem name="Add Refueling" path="#" />
        <NavigationItem name="Add Expense" path="#" />
        <NavigationItem name="Your Vehicles" path="#" />
        <NavigationItem name="Profile" path="#" />
      </ul>
    </nav>
  );
};

export default Sidebar;
