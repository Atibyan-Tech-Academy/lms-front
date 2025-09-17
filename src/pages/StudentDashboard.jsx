import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { isAuthenticated, getRole } from "../services/auth";
import StudentLayout from "../layouts/StudentLayout";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.hash.slice(1) || "courses";

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "STUDENT") {
      navigate("/login");
      return;
    }
    API.get("courses/enrolled/")
      .then((res) => setCourses(res.data))
      .catch((err) => setError("Failed to load courses."));
    API.get("accounts/profile/")
      .then((res) => setProfile(res.data))
      .catch((err) => setError("Failed to load profile."));
    API.get("announcements/")
      .then((res) => setAnnouncements(res.data))
      .catch((err) => setError("Failed to load announcements."));
  }, [navigate]);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`courses/${selectedCourse.id}/modules/`)
        .then((res) => setModules(res.data))
        .catch((err) => setError("Failed to load modules."));
      API.get(`courses/${selectedCourse.id}/materials/`)
        .then((res) => setMaterials(res.data))
        .catch((err) => setError("Failed to load materials."));
      API.get(`courses/${selectedCourse.id}/progress/`)
        .then((res) => setProgress(res.data.reduce((acc, p) => ({ ...acc, [p.module]: p.completed }), {})))
        .catch((err) => setError("Failed to load progress."));
    }
  }, [selectedCourse]);

  const markAsComplete = async (moduleId) => {
    try {
      await API.post("progress/", { module_id: moduleId, completed: true });
      setProgress((prev) => ({ ...prev, [moduleId]: true }));
    } catch (err) {
      setError("Failed to update progress.");
    }
  };

  return (
    <StudentLayout>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {activeTab === "courses" && !selectedCourse && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition dark:bg-gray-800"
                onClick={() => setSelectedCourse(course)}
              >
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Object.values(progress).filter(Boolean).length / modules.length * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "courses" && selectedCourse && (
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Courses
          </button>
          <h2 className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
          <h3 className="text-lg font-semibold mb-2">Modules</h3>
          {modules.map((module) => (
            <div key={module.id} className="mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <h4 className="font-semibold text-lg">{module.title}</h4>
              <button
                onClick={() => markAsComplete(module.id)}
                className="py-1 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={progress[module.id]}
              >
                {progress[module.id] ? "Completed" : "Mark as Complete"}
              </button>
            </div>
          ))}
          <h3 className="text-lg font-semibold mt-6 mb-2">Materials</h3>
          {materials.map((material) => (
            <a
              key={material.id}
              href={material.file || material.video}
              className="block text-blue-600 hover:underline mb-1 dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {material.title} ({material.file_type || "file"})
            </a>
          ))}
        </div>
      )}

      {activeTab === "announcements" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Announcements</h2>
          {announcements.map((ann) => (
            <div key={ann.id} className="mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <h3 className="font-semibold">{ann.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{ann.content}</p>
              <small className="text-gray-500">{new Date(ann.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}

      {activeTab === "profile" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p>Name: {profile.display_name || "Loading..."}</p>
          <p>Email: {profile.email || "Loading..."}</p>
          <img src={profile.avatar || "/docs/images/people/profile-picture-3.jpg"} alt="Avatar" className="w-24 h-24 rounded-full mt-4" />
        </div>
      )}
    </StudentLayout>
  );
}