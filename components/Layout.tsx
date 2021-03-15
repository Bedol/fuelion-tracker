import Navigation from "./Navigation";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="container mx-auto py-4">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
