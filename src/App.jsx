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
import AdminLayout from "./layouts/AdminLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";
import NotePages from "./pages/NotePages";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/editprofile" element={<EditProfile />} />

      {/* Student Routes */}
      <Route
        path="/student/*"
        element={
          <PrivateRoute roleCheck={["STUDENT"]}>
            <StudentLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="notes" element={<NotePages />} />
      </Route>

      {/* Instructor Routes */}
      <Route
        path="/instructor/*"
        element={
          <PrivateRoute roleCheck={["LECTURER"]}>
            <InstructorLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="create-course" element={<CreateCourse />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute roleCheck={["ADMIN"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
