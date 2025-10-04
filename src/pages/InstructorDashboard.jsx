// src/pages/InstructorDashboard.jsx
import React, { useState, useEffect } from "react";
import API, { getInstructorDashboard } from "../services/api"; // Correct import from api.js
import { getRole } from "../services/auth"; // Import auth functions from services/auth.js

export default function InstructorDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      console.log("Fetching dashboard data...");
      const response = await getInstructorDashboard();
      console.log("Dashboard response:", response.data);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
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
    console.log("InstructorDashboard mounted, role:", role);
    if (role !== "INSTRUCTOR") {
      console.warn("Role mismatch: Expected INSTRUCTOR, got", role);
    }
    fetchDashboard();
  }, []);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  // Create a new course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      console.log("Creating course with data:", courseForm);
      const response = await API.post("courses/", courseForm);
      console.log("Course created:", response.data);
      setFormSuccess("Course created successfully!");
      setCourseForm({ title: "", description: "" });

      // Refresh dashboard
      fetchDashboard();
    } catch (err) {
      console.error("Error creating course:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setFormError(
        "Failed to create course: " +
          (err.response?.data?.detail ||
            JSON.stringify(err.response?.data) ||
            err.message)
      );
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error)
    return <div className="p-6 text-red-500 font-semibold dark:text-red-400">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Instructor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Total Courses</h2>
          <p className="text-2xl text-gray-800 dark:text-gray-200">{dashboardData.total_courses || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Total Enrollments</h2>
          <p className="text-2xl text-gray-800 dark:text-gray-200">{dashboardData.total_enrollments || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Completed Lessons</h2>
          <p className="text-2xl text-gray-800 dark:text-gray-200">{dashboardData.completed_lessons || 0}</p>
        </div>
      </div>

      {/* Create Course Form */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Create New Course</h2>
        {formError && <p className="text-red-500 dark:text-red-400 mb-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 dark:text-green-400 mb-4">{formSuccess}</p>}

        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Course Title</label>
            <input
              type="text"
              name="title"
              value={courseForm.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={courseForm.description}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Create Course
          </button>
        </form>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Enrollments</h2>
        {dashboardData.recent_enrollments?.length > 0 ? (
          <ul>
            {dashboardData.recent_enrollments.map((enrollment, idx) => (
              <li key={idx} className="mb-2 text-gray-800 dark:text-gray-200">
                <span className="font-semibold">{enrollment.student}</span> enrolled in{" "}
                <span className="font-semibold">{enrollment.course}</span> on{" "}
                {new Date(enrollment.enrolled_at).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-800 dark:text-gray-200">No recent enrollments.</p>
        )}
      </div>
    </div>
  );
}