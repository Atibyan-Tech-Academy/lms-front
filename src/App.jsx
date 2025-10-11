import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom"; // Added Navigate
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
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import Notes from "./pages/Notes";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import ChatWidget from "./components/messaging/ChatWidget";
import AIChatWidget from "./components/messaging/AIChatWidget";
import Messages from "./pages/Messages";
import PrivateRoute from "./components/PrivateRoute";
import ChatBox from "./components/ChatBox";

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
          path="/student"
          element={
            <PrivateRoute roleCheck={["STUDENT"]}>
              <StudentLayout>
                <Outlet />
              </StudentLayout>
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} /> {/* Default to dashboard */}
          <Route path="dashboard" element={<StudentDashboard tab="dashboard" />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="dashboard/announcements" element={<Announcements />} />
          <Route path="dashboard/notes" element={<Notes />} />
          <Route path="dashboard/profile" element={<StudentDashboard tab="profile" />} />
          <Route path="dashboard/settings" element={<StudentDashboard tab="settings" />} />
          <Route path="dashboard/chat" element={<StudentDashboard tab="chat" />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* Instructor Routes */}
        <Route
          path="/instructor"
          element={
            <PrivateRoute roleCheck={["LECTURER"]}>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} /> {/* Default to dashboard */}
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<InstructorDashboard />} /> {/* Placeholder */}
          <Route path="chat" element={<ChatBox roomId="instructor-room" />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roleCheck={["ADMIN"]}>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} /> {/* Default to dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="courses" element={<Courses />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Floating Chat Widgets */}
      {user && ["STUDENT", "LECTURER", "ADMIN"].includes(user.role.toUpperCase()) && (
        <>
          <ChatWidget />
          <AIChatWidget />
        </>
      )}
    </>
  );
}