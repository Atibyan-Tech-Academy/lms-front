import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../services/auth";

// roleCheck = ["STUDENT"], ["LECTURER"], ["ADMIN"], or undefined (any role)
export default function PrivateRoute({ children, roleCheck }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (roleCheck && !roleCheck.includes(getRole())) {
    return <Navigate to="/login" />;
  }

  return children;
}
