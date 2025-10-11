// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roleCheck }) {
  const { user, loading } = useAuth();

  console.log("PrivateRoute - User:", user, "Loading:", loading, "RoleCheck:", roleCheck); // Debug

  if (loading) return <div>Loading...</div>;

  if (!user) {
    console.log("Redirecting to login: No user");
    return <Navigate to="/login" />;
  }

  if (roleCheck && !roleCheck.includes(user.role)) {
    console.log("Redirecting to login: Role mismatch", { userRole: user.role, requiredRoles: roleCheck });
    return <Navigate to="/login" />;
  }

  return children;
}