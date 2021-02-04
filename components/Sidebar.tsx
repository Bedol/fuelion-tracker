import SidebarLink from "./SidebarLink";

const Sidebar = () => {
  return (
    <div>
      <ul className="list-reset">
        <SidebarLink name="Home" path="#" />
        <SidebarLink name="Add Refueling" path="#" />
        <SidebarLink name="Add Cost" path="#" />
        <SidebarLink name="Your Vehicles" path="#" />
        <SidebarLink name="Profile" path="#" />
      </ul>
    </div>
  );
};

export default Sidebar;
