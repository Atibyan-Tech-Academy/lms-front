import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div
        style={{
          background: "linear-gradient(to right, #04CE65, #026833)",
          width: "100%",
          textAlign: "center",
          padding: "20px",
          color: "white",
        }}
      >
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">{children}</main>
    </div>
  );
}