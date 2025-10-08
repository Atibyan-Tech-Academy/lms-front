import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInstructorDashboard } from "../services/api";
import { getRole, isAuthenticated } from "../services/auth";

export default function InstructorDashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_courses: 0,
    total_enrollments: 0,
    completed_lessons: 0,
    in_progress_lessons: 0,
    recent_enrollments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    if (!isAuthenticated() || getRole() !== "LECTURER") {
      setError("Access denied: Not an instructor.");
      setLoading(false);
      navigate("/login");
      return;
    }
    fetchDashboard();
  }, [navigate]);

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
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Recent Enrollments</h3>
        {dashboardData.recent_enrollments.length > 0 ? (
          <ul className="mt-2">
            {dashboardData.recent_enrollments.map((enrollment, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-lg mb-2 dark:bg-gray-800">
                <p>
                  {enrollment.student} enrolled in {enrollment.course} on{" "}
                  {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent enrollments.</p>
        )}
      </div>
    </div>
  );
}
