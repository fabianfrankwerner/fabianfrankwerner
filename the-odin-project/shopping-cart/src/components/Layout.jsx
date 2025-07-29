import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";
import Background from "./Background";

const Layout = () => (
  <>
    <Background />
    <Navigation />
    <Outlet />
  </>
);

export default Layout;
