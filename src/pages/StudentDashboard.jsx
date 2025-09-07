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
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      {profile ? (
        <div className="bg-white p-6 rounded-lg shadow max-w-lg">
          <p>
            <strong>Name:</strong> {profile.display_name || profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Student ID:</strong> {profile.student_id}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </DashboardLayout>
  );
}
