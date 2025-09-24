// src/pages/InstructorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getInstructorCourses, createCourse, createModule, createMaterial, getCourseModules, getCourseMaterials, getCourseProgress, createAnnouncement, getInstructorDashboard } from "../services/api";
import { isAuthenticated, getRole } from "../services/auth";
import InstructorLayout from "../layouts/InstructorLayout";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [newModule, setNewModule] = useState({ title: "", order: 1 });
  const [newMaterial, setNewMaterial] = useState({ title: "", file: null });
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [progress, setProgress] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.hash.slice(1) || "my-courses";

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "INSTRUCTOR") { // Changed LECTURER to INSTRUCTOR
      navigate("/login");
      return;
    }
    fetchInitialData();
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      const [coursesRes, profileRes] = await Promise.all([
        getInstructorCourses(),
        API.get("accounts/profile/"),
      ]);
      setCourses(coursesRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      setError("Failed to load data: " + (err.response?.data?.detail || err.message));
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      Promise.all([
        getCourseModules(selectedCourse.id),
        getCourseMaterials(selectedCourse.id),
        getCourseProgress(selectedCourse.id),
        API.get(`courses/${selectedCourse.id}/announcements/`),
      ])
        .then(([modulesRes, materialsRes, progressRes, announcementsRes]) => {
          setModules(modulesRes.data);
          setMaterials(materialsRes.data);
          setProgress(modulesRes.data.reduce((acc, m) => ({ ...acc, [m.id]: progressRes.data.find(p => p.module === m.id)?.completed || false }), {}));
          setAnnouncements(announcementsRes.data);
        })
        .catch(err => setError("Failed to load course details: " + err.message));
    }
  }, [selectedCourse]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await createCourse(newCourse);
      setCourses([...courses, res.data]);
      setNewCourse({ title: "", description: "" });
    } catch (err) {
      setError("Failed to create course: " + err.message);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const res = await createModule(selectedCourse.id, newModule);
      setModules([...modules, res.data]);
      setNewModule({ title: "", order: 1 });
    } catch (err) {
      setError("Failed to create module: " + err.message);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!selectedModuleId) return;
    const formData = new FormData();
    formData.append("title", newMaterial.title);
    if (newMaterial.file) formData.append("file", newMaterial.file);

    try {
      await createMaterial(selectedModuleId, formData);
      const res = await getCourseMaterials(selectedCourse.id);
      setMaterials(res.data);
      setNewMaterial({ title: "", file: null });
    } catch (err) {
      setError("Failed to upload material: " + err.message);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    const newAnnouncement = { title: "New Announcement", content: "Sample content", course: selectedCourse.id };
    try {
      const res = await createAnnouncement(selectedCourse.id, newAnnouncement);
      setAnnouncements([...announcements, res.data]);
    } catch (err) {
      setError("Failed to post announcement: " + err.message);
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
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition dark:bg-gray-800"
                onClick={() => setSelectedCourse(course)}
              >
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "my-courses" && selectedCourse && (
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 text-blue-600 hover:underline dark:text-blue-400"
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
            <input
              type="number"
              value={newModule.order}
              onChange={(e) => setNewModule({ ...newModule, order: e.target.value })}
              placeholder="Order"
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
              className="block text-blue-600 hover:underline mb-1 dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {material.title} ({material.file_type || "file"})
            </a>
          ))}
          <h3 className="text-lg font-semibold mt-6 mb-2">Student Progress</h3>
          {Object.entries(progress).map(([moduleId, completed]) => (
            <p key={moduleId} className="mb-1">
              Module {modules.find(m => m.id === parseInt(moduleId))?.title}: {completed ? "Completed" : "In Progress"}
            </p>
          ))}
          <h3 className="text-lg font-semibold mt-6 mb-2">Announcements</h3>
          {announcements.map((ann) => (
            <div key={ann.id} className="mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <h3 className="font-semibold">{ann.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{ann.content}</p>
              <small className="text-gray-500">{new Date(ann.created_at).toLocaleDateString()}</small>
            </div>
          ))}
          <button
            onClick={handlePostAnnouncement}
            className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Post Announcement
          </button>
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
          <button
            onClick={handlePostAnnouncement}
            className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Post Announcement
          </button>
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
    </InstructorLayout>
  );
}