// LMS-FRONT/src/layouts/DashboardLayout.jsx
import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { useAuth } from "../context/AuthContext";
import { NavLink, Route, Routes } from "react-router-dom"; // Added Routes for rendering
import ChatBox from "../components/ChatBox"; // Import ChatBox
import MessagingPage from "./components/MessagingPage";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  const tabs = [
    { name: "Overview", path: "/dashboard" },
    { name: "Courses", path: "/dashboard/courses" },
    { name: "Profile", path: "/dashboard/profile" },
    { name: "Settings", path: "/dashboard/settings" },
    { name: "Chat", path: "/dashboard/chat" }, // Add Chat tab
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
        {/* Welcome Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Welcome{" "}
          {user?.first_name
            ? `${user.first_name} ${user.last_name}`
            : user?.display_name ||
              user?.username ||
              user?.student_id ||
              "User"}
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-600 mb-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-t-lg ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>

        {/* Page Content with Routes */}
        <div className="mt-6">
          <Routes>
            {/* Default content for other tabs */}
            <Route path="/*" element={children} />
            {/* Chat route */}
            <Route path="chat" element={<ChatBox roomId="room1" />} />
            <Route path="/messaging" element={<MessagingPage currentUserId={user.id} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}