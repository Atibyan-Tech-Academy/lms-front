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
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [newModule, setNewModule] = useState({ title: "" });
  const [newMaterial, setNewMaterial] = useState({ title: "", file: null });
  const [selectedModuleId, setSelectedModuleId] = useState(null);
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
    API.get("courses/manage/") // Match your original endpoint
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
        .catch((err) => {
          console.error("Modules error:", err.response?.data);
          setError("Failed to load modules.");
        });
      API.get(`courses/${selectedCourse.id}/materials/`)
        .then((res) => setMaterials(res.data))
        .catch((err) => {
          console.error("Materials error:", err.response?.data);
          setError("Failed to load materials.");
        });
    }
  }, [selectedCourse]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("courses/", newCourse);
      setCourses([...courses, res.data]);
      setNewCourse({ title: "", description: "" });
    } catch (err) {
      console.error("Course creation error:", err.response?.data);
      setError("Failed to create course.");
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const res = await API.post(`courses/${selectedCourse.id}/modules/`, newModule);
      setModules([...modules, res.data]);
      setNewModule({ title: "" });
    } catch (err) {
      console.error("Module creation error:", err.response?.data);
      setError("Failed to create module.");
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!selectedModuleId) return;
    const formData = new FormData();
    formData.append("title", newMaterial.title);
    formData.append("module", selectedModuleId);
    if (newMaterial.file) formData.append("file", newMaterial.file);

    try {
      const res = await API.post("materials/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload success:", res.data);
      API.get(`courses/${selectedCourse.id}/materials/`).then((res) => setMaterials(res.data));
      setNewMaterial({ title: "", file: null });
    } catch (err) {
      console.error("Upload error:", err.response?.data);
      setError("Failed to upload material.");
    }
  };

  return (
    <InstructorLayout>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {activeTab === "my-courses" && !selectedCourse && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <form onSubmit={handleCreateCourse} className="mb-6 space-y-4 max-w-md">
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              placeholder="Course Title"
              className="w-full p-3 border rounded-lg"
              required
            />
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              placeholder="Description"
              className="w-full p-3 border rounded-lg"
            />
            <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Course
            </button>
          </form>
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
          <form onSubmit={handleCreateModule} className="mb-6 space-y-4 max-w-md">
            <input
              type="text"
              value={newModule.title}
              onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
              placeholder="Module Title"
              className="w-full p-3 border rounded-lg"
              required
            />
            <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Module
            </button>
          </form>
          <h3 className="text-lg font-semibold mb-2">Modules</h3>
          <select
            value={selectedModuleId || ""}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="">Select a Module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>{module.title}</option>
            ))}
          </select>
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
              accept="application/pdf,video/*,audio/*,text/*,image/*"
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
              href={material.file || material.video}
              className="block text-blue-600 hover:underline mb-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {material.title} ({material.file_type || "file"})
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