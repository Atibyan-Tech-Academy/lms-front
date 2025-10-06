// LMS-FRONT/src/layouts/DashboardLayout.jsx
import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { NavLink, Route, Routes } from "react-router-dom";
import ChatBox from "../components/ChatBox";

export default function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const role = user?.role || "STUDENT"; // default fallback

  // ✅ Role-based navigation tabs
  const tabsByRole = {
    STUDENT: [
      { name: "Overview", path: "/dashboard" },
      { name: "Courses", path: "/dashboard/courses" },
      { name: "Profile", path: "/dashboard/profile" },
      { name: "Settings", path: "/dashboard/settings" },
      { name: "Chat", path: "/dashboard/chat" },
    ],
    INSTRUCTOR: [
      { name: "Overview", path: "/instructor" },
      { name: "Courses", path: "/instructor/courses" },
      { name: "Profile", path: "/instructor/profile" },
      { name: "Settings", path: "/instructor/settings" },
      { name: "Chat", path: "/instructor/chat" },
    ],
    ADMIN: [
      { name: "Overview", path: "/admin" },
      { name: "Users", path: "/admin/users" },
      { name: "Reports", path: "/admin/reports" },
      { name: "Settings", path: "/admin/settings" },
    ],
  };

  const tabs = tabsByRole[role] || tabsByRole["STUDENT"];

  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Welcome{" "}
          {user?.first_name
            ? `${user.first_name} ${user.last_name}`
            : user?.display_name ||
              user?.username ||
              user?.staff_id ||
              user?.student_id ||
              "User"}
        </h1>

        {/* ✅ Tabs */}
        <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-600 mb-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-t-lg ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:text-green-600"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>

        {/* ✅ Page content */}
        <div className="mt-6">
          <Routes>
            <Route path="/*" element={children} />
            <Route path="chat" element={<ChatBox roomId="instructor-room" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
