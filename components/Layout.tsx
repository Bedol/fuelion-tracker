import Sidebar from "./Sidebar";

type LayoutProps = {
  children: unknown;
};

const Layout = (props: LayoutProps) => {
  return (
    <div className="container">
      <Sidebar />

      {props.children}
    </div>
  );
};

export default Layout;
