// src/pages/InstructorDashboard.jsx
import React from "react";

export default function InstructorDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">My Classes</h2>
          <p className="text-gray-600 mt-2">4 Active</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Submissions</h2>
          <p className="text-gray-600 mt-2">12 Pending Reviews</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Messages</h2>
          <p className="text-gray-600 mt-2">2 New</p>
        </div>
      </div>
    </div>
  );
}
