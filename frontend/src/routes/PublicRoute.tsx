import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: ReactNode }) =>
  localStorage.getItem("token") ? <Navigate to="/user" replace /> : <>{children}</>;
