import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <Navigation />
    <Outlet />
  </>
);

export default Layout;
