import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { isAuthenticated, getRole } from "../services/auth";
import InstructorLayout from "../layouts/InstructorLayout";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ title: "", file: null });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.hash.slice(1) || "my-courses";

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "LECTURER") {
      console.log("Not authenticated or not LECTURER, redirecting to /login");
      navigate("/login");
      return;
    }
    API.get("courses/manage/")
      .then((res) => {
        console.log("Managed courses fetched:", res.data);
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("Courses error:", err.response?.data);
        setError("Failed to load managed courses.");
      });
  }, [navigate]);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`courses/${selectedCourse.id}/modules/`)
        .then((res) => setModules(res.data))
        .catch((err) => setError("Failed to load modules."));
      API.get(`courses/${selectedCourse.id}/materials/`)
        .then((res) => setMaterials(res.data))
        .catch((err) => setError("Failed to load materials."));
    }
  }, [selectedCourse]);

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newMaterial.title);
    formData.append("file", newMaterial.file);
    formData.append("course_id", selectedCourse.id);

    try {
      await API.post("courses/materials/", formData);
      setNewMaterial({ title: "", file: null });
      API.get(`courses/${selectedCourse.id}/materials/`).then((res) => setMaterials(res.data));
      setError(null);
    } catch (err) {
      console.error("Material upload error:", err.response?.data);
      setError("Failed to upload material.");
    }
  };

  return (
    <InstructorLayout>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {activeTab === "my-courses" && !selectedCourse && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedCourse(course)}
              >
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "my-courses" && selectedCourse && (
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Courses
          </button>
          <h2 className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
          <h3 className="text-lg font-semibold mb-2">Modules</h3>
          {modules.map((module) => (
            <div key={module.id} className="mb-4 p-4 bg-white rounded-lg shadow">
              <h4 className="font-semibold text-lg">{module.title}</h4>
              <p className="text-gray-600">{module.description}</p>
            </div>
          ))}
          <h3 className="text-lg font-semibold mt-6 mb-2">Upload Material</h3>
          <form onSubmit={handleUploadMaterial} className="space-y-4 max-w-md">
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
              placeholder="Material Title"
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="file"
              accept="application/pdf,video/*,audio/*,text/*"
              onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
              className="w-full p-3 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Material
            </button>
          </form>
          <h3 className="text-lg font-semibold mt-6 mb-2">Existing Materials</h3>
          {materials.map((material) => (
            <a
              key={material.id}
              href={material.file}
              className="block text-blue-600 hover:underline mb-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {material.title} ({material.file_type})
            </a>
          ))}
        </div>
      )}

      {activeTab === "messages" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <p>Message feature coming soon for instructors.</p>
        </div>
      )}
    </InstructorLayout>
  );
}