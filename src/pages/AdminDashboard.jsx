
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllUsers, getAllCourses, getAllModules, getAllMaterials, getEnrollments, getProgress, getAnnouncements, createCourse } from "../services/api";
import { isAuthenticated, getRole } from "../services/auth";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.hash.slice(1) || "users";

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "ADMIN") {
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        const [
          usersRes,
          coursesRes,
          modulesRes,
          materialsRes,
          enrollmentsRes,
          progressRes,
          announcementsRes,
        ] = await Promise.all([
          getAllUsers(),
          getAllCourses(),
          getAllModules(),
          getAllMaterials(),
          getEnrollments(),
          getProgress(),
          getAnnouncements(),
        ]);

        setUsers(usersRes.data || []);
        setCourses(coursesRes.data || []);
        setModules(modulesRes.data || []);
        setMaterials(materialsRes.data || []);
        setEnrollments(enrollmentsRes.data || []);
        setProgress(progressRes.data || []);
        setAnnouncements(announcementsRes.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load admin dashboard data: " + (err.response?.data?.detail || err.message));
        console.error(err);
      }
    };

    fetchAllData();
  }, [navigate]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await createCourse(newCourse);
      setCourses([...courses, res.data]);
      setNewCourse({ title: "", description: "" });
      setError(null);
    } catch (err) {
      setError("Failed to create course: " + (err.response?.data?.detail || err.message));
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          {users.length === 0 ? (
            <p>No users available.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <li key={user.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                  <p>
                    <strong>{user.username}</strong> ({user.email})
                  </p>
                  <p>Role: {user.role}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "courses" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
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
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Course
            </button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "modules" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div key={module.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="text-xl font-semibold">{module.title}</h3>
                <p>Course: {module.course?.title || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "materials" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material) => (
              <div key={material.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="text-xl font-semibold">{material.title}</h3>
                <p>Module: {material.module?.title || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "enrollments" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Enrollments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enroll) => (
              <div key={enroll.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <p>
                  {enroll.student?.username || "N/A"} - {enroll.course_title || enroll.course?.title || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "progress" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Student Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.map((p) => (
              <div key={p.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <p>
                  {p.student?.username || "N/A"} - {p.module_title || p.module?.title || "N/A"}: {p.completed ? "Completed" : "In Progress"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "announcements" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="font-semibold">{ann.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
