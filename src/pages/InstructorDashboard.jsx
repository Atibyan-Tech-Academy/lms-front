// src/pages/InstructorDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../services/api";
import { getRole } from "../services/auth";

export default function InstructorDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    console.log("InstructorDashboard mounted, role:", getRole());
    const fetchDashboard = async () => {
      try {
        console.log("Fetching dashboard data...");
        const response = await API.get("courses/instructor/dashboard/");
        console.log("Dashboard response:", response.data);
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError("Failed to load dashboard data: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      console.log("Creating course with data:", courseForm);
      const response = await API.createCourse(courseForm);
      console.log("Course creation response:", response.data);
      setFormSuccess("Course created successfully!");
      setCourseForm({ title: "", description: "", category: "" });
      const dashboardResponse = await API.get("courses/instructor/dashboard/");
      setDashboardData(dashboardResponse.data);
    } catch (err) {
      console.error("Error creating course:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setFormError("Failed to create course: " + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard Content</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Courses</h2>
          <p className="text-2xl">{dashboardData.total_courses || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Enrollments</h2>
          <p className="text-2xl">{dashboardData.total_enrollments || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Completed Lessons</h2>
          <p className="text-2xl">{dashboardData.completed_lessons || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              value={courseForm.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={courseForm.description}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={courseForm.category}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Course
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Enrollments</h2>
        {dashboardData.recent_enrollments?.length > 0 ? (
          <ul>
            {dashboardData.recent_enrollments.map((enrollment, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{enrollment.student}</span> enrolled in{" "}
                <span className="font-semibold">{enrollment.course}</span> on{" "}
                {new Date(enrollment.enrolled_at).toLocaleDateString()}
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