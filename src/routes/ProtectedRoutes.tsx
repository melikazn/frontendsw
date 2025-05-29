import { JSX } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export const ProtectedUserRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "student") {
    return <Navigate to="/login" replace />;
  }

  return children;
};
