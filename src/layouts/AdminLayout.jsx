import React from "react";
import DashboardLayout from "./DashboardLayout";

export default function AdminLayout({ children }) {
  return (
    <DashboardLayout>
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
      <div className="p-6 bg-gray-50 dark:bg-gray-800">{children}</div>
    </DashboardLayout>
  );
}
