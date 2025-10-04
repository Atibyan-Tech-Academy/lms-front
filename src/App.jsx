// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import Faq from "./components/Faq"; // Import Faq component
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";
import ChatWidget from "./components/messaging/ChatWidget";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("access");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/faqs" element={<Faq />} /> {/* Added FAQ route */}

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

        <Route
          path="/instructor"
          element={
            <PrivateRoute roleCheck={["INSTRUCTOR"]}>
              <Navigate to="/instructor/dashboard" />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/dashboard"
          element={
            <PrivateRoute roleCheck={["INSTRUCTOR"]}>
              <DashboardLayout>
                <InstructorDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/my-courses"
          element={
            <PrivateRoute roleCheck={["INSTRUCTOR"]}>
              <DashboardLayout>
                <MyCourses />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/create-course"
          element={
            <PrivateRoute roleCheck={["INSTRUCTOR"]}>
              <DashboardLayout>
                <CreateCourse />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

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
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>

      {user && ["STUDENT", "INSTRUCTOR", "ADMIN"].includes(user.role) && (
        <ChatWidget token={token} user={user} />
      )}
    </>
  );
}