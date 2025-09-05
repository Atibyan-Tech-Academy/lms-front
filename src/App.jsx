import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/student"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/instructor"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <InstructorDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute roleCheck={["ADMIN"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
