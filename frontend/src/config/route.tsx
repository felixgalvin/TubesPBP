import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LoginPage } from "../page/LoginPage";
import RegisterPage from "../page/Register";
import {HomePage} from "../page/HomePage";
import ProfilePage from "../page/ProfilePage";
import PostPage from "../page/PostPage";
import UserLayout from "../page/UserLayout";
import path from "path";
import AuthLayout from "../page/AuthLayout";

const isAuthenticated = localStorage.getItem("token") !== null; 

const Routers = createBrowserRouter([
  {
    path: "",
    element: !isAuthenticated ? <HomePage /> : <Navigate to="/user" />,
  },
  {
    path: "/",
    element: !isAuthenticated ? <HomePage /> : <Navigate to="/user" />,
  },
  {
    path: "/auth",
    element:  <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> }, // default route
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> }
    ]
  },
  {
    path: "/user",
    element: isAuthenticated ? <UserLayout /> : <Navigate to="/login" />,
    children: [
      { index: true, element: <HomePage /> }, // default route
      { path: "post", element: <PostPage /> },
      { path: "profile", element: <ProfilePage /> }
    ]
  }
  
  // {
  //   path: "/user/post",
  //   element: isAuthenticated ? <PostPage /> : <Navigate to="/login" />,
  // },
  
]);

export function Router() {
  return <RouterProvider router={Routers} />;
}
