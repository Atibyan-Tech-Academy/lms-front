// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("profile/")
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>

      {profile ? (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg">
          <p className="mb-2">
            <strong>Name:</strong> {profile.display_name || profile.username}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="mb-2">
            <strong>Student ID:</strong> {profile.student_id}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </DashboardLayout>
  );
}
