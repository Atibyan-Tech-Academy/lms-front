// src/pages/AdminDashboard.jsx
import React from "react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-gray-600 mt-2">120 Registered</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Courses</h2>
          <p className="text-gray-600 mt-2">15 Active</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Reports</h2>
          <p className="text-gray-600 mt-2">5 Pending</p>
        </div>
      </div>
    </div>
  );
}
