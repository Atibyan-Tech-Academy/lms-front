// src/layouts/StudentLayout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "./DashboardLayout";

export default function StudentLayout() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Student Dashboard</h2>
            <p className="text-sm text-gray-400">{user?.username || "Student"}</p>
          </div>
          <nav>
            <ul>
              <li className="mb-2">
                <Link
                  to="/student/dashboard"
                  className="block p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Overview
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/student/my-courses" // Changed from /student/dashboard/courses
                  className="block p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/student/dashboard/announcements"
                  className="block p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Announcements
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/student/dashboard/profile"
                  className="block p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/student/dashboard/settings"
                  className="block p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/student/dashboard/chat"
                  className="block p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Chat
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Green Gradient Header */}
          <div
            style={{
              background: "linear-gradient(to right, #04CE65, #026833)",
              width: "100%",
              textAlign: "center",
              padding: "20px",
              color: "white",
            }}
          >
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
          </div>

          {/* Page Content Area */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}