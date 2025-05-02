import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LoginPage } from "../page/LoginPage";
// import Register from "../page/RegisterPage";
import {HomePage} from "../page/HomePage";

// const isAuthenticated = localStorage.getItem("token") !== null; 

const Routers = createBrowserRouter([
  {
    path: "/",
    // element: isAuthenticated ? <HomePage /> : <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // path: "/register",
    // element: <Register />,
  },
  {
    path: "/home",
    // element: isAuthenticated ? <HomePage /> : <Navigate to="/login" />,
    element: <HomePage />,
  },
]);

export function Router() {
  return <RouterProvider router={Routers} />;
}