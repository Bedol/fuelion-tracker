import Navigation from "./Navigation";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="container mx-auto">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
