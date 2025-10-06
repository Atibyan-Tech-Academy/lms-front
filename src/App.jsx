import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorLayout from "./layouts/InstructorLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";
import NotFound from "./pages/NotFound";
import { getRole, isAuthenticated } from "./services/auth";

// 🔒 Private route component
const PrivateRoute = ({ children, roleCheck }) => {
  const authenticated = isAuthenticated();
  const role = getRole();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (roleCheck && !roleCheck.includes(role)) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <h1 className="text-xl font-bold text-red-600">
          Access denied: You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===================== ADMIN ROUTES ===================== */}
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

        {/* ===================== INSTRUCTOR ROUTES ===================== */}
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
        <Route
          path="/instructor/my-courses"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <InstructorLayout>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">My Courses</h2>
                  <p>List of courses you teach will appear here.</p>
                </div>
              </InstructorLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/create-course"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <InstructorLayout>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Create a New Course</h2>
                  <p>Form for adding a new course will appear here.</p>
                </div>
              </InstructorLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/profile"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <InstructorLayout>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Instructor Profile</h2>
                  <p>Profile management for the instructor.</p>
                </div>
              </InstructorLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/settings"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <InstructorLayout>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Settings</h2>
                  <p>Instructor settings will appear here.</p>
                </div>
              </InstructorLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/chat"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <InstructorLayout>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Chat</h2>
                  <p>Instructor chat system appears here.</p>
                </div>
              </InstructorLayout>
            </PrivateRoute>
          }
        />

        {/* ===================== STUDENT ROUTES ===================== */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </PrivateRoute>
          }
        />

        {/* ===================== FALLBACK ROUTE ===================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
