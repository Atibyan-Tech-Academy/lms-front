import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import StudentLayout from "./layouts/StudentLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminLayout from "./layouts/AdminLayout";

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/student/*"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/instructor/*"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <InstructorLayout>
              <InstructorDashboard />
            </InstructorLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <PrivateRoute roleCheck={["ADMIN"]}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
