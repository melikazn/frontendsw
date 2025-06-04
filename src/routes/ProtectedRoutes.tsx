import { JSX } from "react";
import { Navigate } from "react-router-dom";

//  Skyddar admin-sidor 
export const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  // Hämtar användaren från localStorage och försöker parsa den till objekt
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Om ingen användare finns eller rollen inte är "admin"  omdirigeras till admin-inloggning
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  // Om allt stämmer, rendera den skyddade komponenten
  return children;
};

// Skyddar vanliga användarsidor 
export const ProtectedUserRoute = ({ children }: { children: JSX.Element }) => {
  // Hämtar användaren från localStorage och försöker parsa den till objekt
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Om ingen användare finns eller rollen inte är "student" omdirigera till vanlig inloggning
  if (!user || user.role !== "student") {
    return <Navigate to="/login" replace />;
  }

  // Om allt stämmer, rendera den skyddade komponenten
  return children;
};
