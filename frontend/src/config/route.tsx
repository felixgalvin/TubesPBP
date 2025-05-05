import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LoginPage } from "../page/LoginPage";
import Register from "../page/Register";
import {HomePage} from "../page/HomePage";

const isAuthenticated = localStorage.getItem("token") !== null; 
// const isAuthenticated = true; // Set to true for testing purposes

const Routers = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    // element: isAuthenticated ? <HomePage /> : <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/homeLogin",
        element: isAuthenticated ? <HomePage /> : <Navigate to="/login" />,

  },
]);

export function Router() {
  return <RouterProvider router={Routers} />;
}
