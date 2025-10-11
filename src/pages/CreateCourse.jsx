import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createCourse({
        title,
        description,
        created_by: user?.id, // Associate with the logged-in instructor
      });
      console.log("Course created:", response.data);
      setSuccess(true);
      setTimeout(() => navigate("/instructor/my-courses"), 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Create course error:", err);
      setError(
        err.response?.data?.title ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Failed to create course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      {success && <p className="text-green-500 mb-4">Course created successfully! Redirecting...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}