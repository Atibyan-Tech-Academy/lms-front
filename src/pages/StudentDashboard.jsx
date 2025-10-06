// Corrected StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getEnrollments,
  getCourse,
  getProgress,
  getProfile,
  getAnnouncements,
  markAsComplete,
} from "../services/api";
import { isAuthenticated, getRole } from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user, setUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [allProgress, setAllProgress] = useState([]);  // Fetch all once
  const [announcements, setAnnouncements] = useState([]);
  const [profile, setProfile] = useState(user || {});
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.hash.slice(1) || "courses";

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "STUDENT") {
      navigate("/login");
      return;
    }
    fetchInitialData();
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      const [enrollmentsRes, profileRes, announcementsRes, progressRes] = await Promise.all([
        getEnrollments(),
        getProfile(),
        getAnnouncements(),
        getProgress(),  // Fetch all progress here
      ]);
      // Enrollments include nested course data (title, desc, modules, materials)
      setCourses(enrollmentsRes.data.map(e => e.course) || []);
      setProfile(profileRes.data || {});
      setAnnouncements(announcementsRes.data || []);
      setAllProgress(progressRes.data || []);
      if (profileRes.data) setUser(profileRes.data);
    } catch (err) {
      setError(
        "Failed to load dashboard data: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      // Fetch full course details (includes modules with materials)
      getCourse(selectedCourse.id)
        .then(res => {
          setModules(res.data.modules || []);
          setMaterials(res.data.modules.flatMap(m => m.materials || []) || []);
        })
        .catch(err => setError("Failed to load course details: " + err.message));
    }
  }, [selectedCourse]);

  // Helper to get progress for a module
  const getModuleProgress = (moduleId) => {
    const progItem = allProgress.find(p => p.module === moduleId);
    return progItem ? progItem.completed : false;
  };

  const handleMarkAsComplete = async (moduleId) => {
    try {
      const res = await markAsComplete(moduleId);
      // Update local allProgress
      setAllProgress(prev => prev.map(p => p.module === moduleId ? res.data : p));
    } catch (err) {
      setError("Failed to update progress: " + err.message);
    }
  };

  return (
    <div>
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
                <p className="text-gray-600 dark:text-gray-400">
                  {course.description}
                </p>
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
            <div
              key={module.id}
              className="mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800"
            >
              <h4 className="font-semibold text-lg">{module.title}</h4>
              <button
                onClick={() => handleMarkAsComplete(module.id)}
                className="mt-2 py-1 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={getModuleProgress(module.id)}
              >
                {getModuleProgress(module.id) ? "Completed" : "Mark as Complete"}
              </button>
            </div>
          ))}

          <h3 className="text-lg font-semibold mt-6 mb-2">Materials</h3>
          {materials.map((material) => (
            <a
              key={material.id}
              href={material.file || material.video || material.video_url}
              className="block text-blue-600 hover:underline mb-1 dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {material.title}
            </a>
          ))}
        </div>
      )}

      {activeTab === "announcements" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Announcements</h2>
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800"
            >
              <h3 className="font-semibold">{ann.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {ann.content}
              </p>
              <small className="text-gray-500">
                {new Date(ann.created_at).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      )}

      {activeTab === "profile" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p>
            <strong>Name:</strong>{" "}
            {profile.first_name && profile.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : "Loading..."}
          </p>
          <p>
            <strong>Email:</strong> {profile.email || "Loading..."}
          </p>
          <img
            src={
              profile.profile_image ||
              "/docs/images/people/profile-picture-3.jpg"
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full mt-4"
          />
        </div>
      )}
    </div>
  );
}