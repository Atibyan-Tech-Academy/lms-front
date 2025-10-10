import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import Faq from "./components/Faq";
import SupportPage from "./components/supportpage";
import PageNotFound from "./pages/PageNotFound";
import StudentLayout from "./layouts/StudentLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";
import ChatWidget from "./components/messaging/ChatWidget";
import AIChatWidget from "./components/messaging/AIChatWidget"; // Add new import
import Messages from "./pages/Messages";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/support" element={<SupportPage />} />

        {/* Student Routes */}
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
        <Route
          path="/student/messages"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <StudentLayout>
                <Messages />
              </StudentLayout>
            </PrivateRoute>
          }
        />

        {/* Instructor Routes */}
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
        <Route
          path="/instructor/messages"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
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
        <Route
          path="/admin/messages"
          element={
            <PrivateRoute roleCheck={["ADMIN"]}>
              <AdminLayout>
                <Messages />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Floating Chat Widgets */}
      {user && ["STUDENT", "LECTURER", "ADMIN"].includes(user.role) && (
        <>
          <ChatWidget />
          <AIChatWidget />
        </>
      )}
    </>
  );
}