// src/layouts/DashboardLayout.jsx
import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
        {children}
      </main>
    </div>
  );
}
