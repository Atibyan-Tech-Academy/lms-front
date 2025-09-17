import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { isAuthenticated, getRole } from "../services/auth";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [profile, setProfile] = useState({ display_name: "", email: "", avatar: null });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab from URL hash
  const activeTab = location.hash.slice(1) || "courses";

  // Fetch courses on mount
  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "STUDENT") {
      navigate("/login");
      return;
    }
    API.get("courses/")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load courses."));
  }, [navigate]);

  // ...other effects and handlers (same as you had) ...

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Courses Tab */}
      {activeTab === "courses" && !selectedCourse && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
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

      {/* ...rest of tabs (messages, profile, ai, sticky notes) ... */}
    </>
  );
}
