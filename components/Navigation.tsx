import { Menubar } from "primereact/menubar";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

const Navigation = () => {
  const router = useRouter();

  const items = [
    {
      label: "Add Refueling",
      icon: "pi pi-fw pi-plus-circle",
      command: (e) => {
        e.preventDefault;
        router.push("/fueling/new");
      },
    },
    {
      label: "Add Expense",
      icon: "pi pi-fw pi-plus-circle",
      command: (e) => {
        e.preventDefault;
        router.push("/expenses/new");
      },
    },
    {
      label: "Your Vehicles",
      icon: "pi pi-fw pi-list",
      command: (e) => {
        e.preventDefault;
        router.push("/vehicles");
      },
    },
    {
      label: "Profile",
      icon: "pi pi-fw pi-user",
      command: (e) => {
        e.preventDefault;
        router.push("/profiles");
      },
    },
  ];

  const logo = (
    <div className="font-semibold px-4">
      <Link href="/">Fuelion</Link>
    </div>
  );

  return (
    <div>
      <div className="card">
        <Menubar model={items} start={logo} />
      </div>
    </div>
  );
};

export default Navigation;
