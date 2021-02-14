import Navigation from "./Navigation";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="p-4">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
