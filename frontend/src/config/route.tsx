import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LoginPage } from "../page/LoginPage";
import { HomePage } from "../page/HomePage";
import RegisterPage from "../page/Register"; // Uncomment when needed

// Cek autentikasi: token tersimpan di localStorage
const isAuthenticated = localStorage.getItem("token") !== null;
// const isAuthenticated = true;

const Routers = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: isAuthenticated ? <HomePage /> : <Navigate to="/login" />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export function Router() {
  return <RouterProvider router={Routers} />;
}
