// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import Faq from "./components/Faq";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";
import ChatWidget from "./components/messaging/ChatWidget";
import ForgotPassword from "./pages/ForgotPassword";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();
  const token = localStorage.getItem("access");

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/faqs" element={<Faq />} />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard/courses"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <DashboardLayout>
                <StudentDashboard tab="courses" />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard/announcements"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <DashboardLayout>
                <StudentDashboard tab="announcements" />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard/profile"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <DashboardLayout>
                <StudentDashboard tab="profile" />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Lecturer routes */}
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

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roleCheck={["ADMIN"]}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Chat widget for logged-in users */}
      {user && ["STUDENT", "LECTURER", "ADMIN"].includes(user.role) && (
        <ChatWidget token={token} user={user} />
      )}
    </>
  );
}
