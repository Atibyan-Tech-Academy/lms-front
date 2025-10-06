// src/pages/InstructorDashboard.jsx
import React, { useState, useEffect } from "react";
import { getInstructorDashboard } from "../services/api";
import { getRole } from "../services/auth";

export default function InstructorDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await getInstructorDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError(
        "Failed to load dashboard: " +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = getRole();
    if (role !== "LECTURER") {
      setError("Access denied: Not an instructor.");
      setLoading(false);
      return;
    }
    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Instructor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
          <h3 className="text-lg font-semibold">Total Courses</h3>
          <p>{dashboardData.total_courses || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
          <h3 className="text-lg font-semibold">Total Enrollments</h3>
          <p>{dashboardData.total_enrollments || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
          <h3 className="text-lg font-semibold">Completed Lessons</h3>
          <p>{dashboardData.completed_lessons || 0}</p>
        </div>
      </div>
    </div>
  );
}
