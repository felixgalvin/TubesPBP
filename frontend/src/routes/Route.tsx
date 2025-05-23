import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../page/LoginPage";
import RegisterPage from "../page/Register";
import { HomePage } from "../page/HomePage";
import ProfilePage from "../page/ProfilePage";
import PostPage from "../page/PostPage";
import UserLayout from "../page/UserLayout";
import AuthLayout from "../page/AuthLayout";
import CommentPostPage from "../page/CommentPostPage";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

const routers = createBrowserRouter([
  { path: "", element: <PublicRoute><HomePage /></PublicRoute> },
  { path: "/post/:postId/comment", element: <CommentPostPage /> },
  {
    path: "/auth",
    element: <PublicRoute><AuthLayout /></PublicRoute>,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> }
    ]
  },
  {
    path: "/user",
    element: <PrivateRoute><UserLayout /></PrivateRoute>,
    children: [
      { index: true, element: <HomePage /> },
      { path: "post", element: <PostPage /> },
      { path: "profile", element: <ProfilePage /> }
    ]
  }
]);

export function Router() {
  return <RouterProvider router={routers} />;
}
