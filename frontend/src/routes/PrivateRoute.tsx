import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: ReactNode }) =>
  localStorage.getItem("token") ? <>{children}</> : <Navigate to="/auth/login" replace />;
