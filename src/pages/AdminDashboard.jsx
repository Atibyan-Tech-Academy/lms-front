import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { isAuthenticated, getRole } from "../services/auth";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.hash.slice(1) || "users";

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "ADMIN") {
      console.log("Not authenticated or not ADMIN, redirecting to /login");
      navigate("/login");
      return;
    }

    API.get("users/")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users."));

    API.get("courses/")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load courses."));
  }, [navigate]);

  return (
    <AdminLayout>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <li key={user.id} className="p-4 bg-white rounded-lg shadow">
                <p>
                  <strong>{user.username}</strong> ({user.email})
                </p>
                <p>Role: {user.role}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "courses" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <li key={course.id} className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "settings" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <p>Settings feature coming soon for admins.</p>
        </div>
      )}
    </AdminLayout>
  );
}
