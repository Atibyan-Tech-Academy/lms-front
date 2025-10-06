import React from "react";
import DashboardLayout from "./DashboardLayout";

export default function StudentLayout({ children }) {
  return (
    <DashboardLayout>
      {/* ✅ Green Gradient Header (same as Admin) */}
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

      {/* ✅ Page Content Area */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
        {children}
      </div>
    </DashboardLayout>
  );
}
