import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Store from "./components/Store";
import Basket from "./components/Basket";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout as the root element
    children: [
      { index: true, element: <App /> },
      { path: "store", element: <Store /> },
      { path: "basket", element: <Basket /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
