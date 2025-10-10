// src/layouts/InstructorLayout.jsx
import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { NavLink, Route, Routes } from "react-router-dom";
import ChatBox from "../components/ChatBox";

export default function InstructorLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const tabs = [
    { name: "Overview", path: "/instructor/dashboard" },
    { name: "Courses", path: "/instructor/my-courses" },
    { name: "Create Course", path: "/instructor/create-course" },
    { name: "Profile", path: "/instructor/profile" },
    { name: "Settings", path: "/instructor/settings" },
    { name: "Chat", path: "/instructor/messages" },
  ];

  return (
    <DashboardLayout>
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
        {/* ✅ Welcome header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Welcome{" "}
          {user?.first_name
            ? `${user.first_name} ${user.last_name}`
            : user?.display_name || user?.username || "Instructor"}
        </h1>

        {/* ✅ Navigation Tabs */}
        <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-600 mb-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-t-lg ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:text-green-600"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>

        {/* ✅ Page Content */}
        <div className="mt-6">
          <Routes>
            <Route path="/*" element={children} />
            <Route path="chat" element={<ChatBox roomId="instructor-room" />} />
          </Routes>
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
}
