// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import Faq from "./components/Faq";
import SupportPage from "./components/supportpage";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";

// Components
import ChatWidget from "./components/messaging/ChatWidget";
import PrivateRoute from "./components/PrivateRoute";
import PageNotFound from "./pages/PageNotFound";

// Context
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();
  const token = localStorage.getItem("access");

  return (
    <>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/support" element={<SupportPage />} />

        {/* ---------- STUDENT ROUTES ---------- */}
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
        <Route
          path="/student/dashboard/courses"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <StudentLayout>
                <StudentDashboard tab="courses" />
              </StudentLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard/announcements"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <StudentLayout>
                <StudentDashboard tab="announcements" />
              </StudentLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard/profile"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <StudentLayout>
                <StudentDashboard tab="profile" />
              </StudentLayout>
            </PrivateRoute>
          }
        />

        {/* ---------- INSTRUCTOR (LECTURER) ROUTES ---------- */}
        <Route
          path="/instructor/dashboard"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <DashboardLayout>
                <InstructorDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/my-courses"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <DashboardLayout>
                <MyCourses />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/create-course"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <DashboardLayout>
                <CreateCourse />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* ---------- ADMIN ROUTE ---------- */}
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

        {/* ---------- 404 PAGE ---------- */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* ---------- CHAT WIDGET ---------- */}
      {user && ["STUDENT", "LECTURER", "ADMIN"].includes(user.role) && (
        <ChatWidget token={token} user={user} />
      )}
    </>
  );
}
