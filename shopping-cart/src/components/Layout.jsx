import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { BasketProvider } from "./BasketContext";
import Background from "./Background";

const Layout = () => {
  return (
    <BasketProvider>
      <Background />
      <Navigation />
      <Outlet />
    </BasketProvider>
  );
};

export default Layout;
