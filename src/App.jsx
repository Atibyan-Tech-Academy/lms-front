// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import StudentLayout from "./layouts/StudentLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminLayout from "./layouts/AdminLayout";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/editprofile" element={<EditProfile />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <Navigate to="/student/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentLayout>
              
            </StudentLayout>
          </PrivateRoute>
        }
      />

      {/* Instructor Routes */}
      <Route
        path="/instructor"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <Navigate to="/instructor/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/instructor/dashboard"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <InstructorLayout>
              <InstructorDashboard />
            </InstructorLayout>
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roleCheck={["ADMIN"]}>
            <Navigate to="/admin/dashboard" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
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