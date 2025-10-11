// src/layouts/DashboardLayout.js
import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, loading } = useAuth() || { role: "STUDENT", first_name: "", last_name: "", display_name: "", username: "", staff_id: "", student_id: "" };
  const role = user?.role?.toUpperCase() || "STUDENT";

  console.log("DashboardLayout - User:", user, "Role:", role, "Loading:", loading); // Debug

  const tabsByRole = {
    STUDENT: [
      { name: "Overview", path: "/student/dashboard" },
      { name: "Courses", path: "/student/my-courses" }, // Changed to "Courses" for clarity, matches tab list
      { name: "Announcements", path: "/student/dashboard/announcements" },
      { name: "Profile", path: "/student/dashboard/profile" },
      { name: "Settings", path: "/student/dashboard/settings" },
      { name: "Chat", path: "/student/dashboard/chat" },
    ],
    INSTRUCTOR: [
      { name: "Overview", path: "/instructor/dashboard" },
      { name: "My Courses", path: "/instructor/my-courses" },
      { name: "Create Course", path: "/instructor/create-course" },
      { name: "Profile", path: "/instructor/profile" },
      { name: "Settings", path: "/instructor/settings" },
      { name: "Chat", path: "/instructor/chat" },
    ],
    ADMIN: [
      { name: "Overview", path: "/admin/dashboard" },
      { name: "Users", path: "/admin/dashboard" },
      { name: "Reports", path: "/admin/dashboard" },
      { name: "Settings", path: "/admin/dashboard" },
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

        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}