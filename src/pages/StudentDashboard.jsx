import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { isAuthenticated, logout, getRole } from "../services/auth";
import StudentLayout from "../layouts/StudentLayout";

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

  // Get active tab from URL hash
  const activeTab = location.hash.slice(1) || "courses";

  // Fetch courses on mount
  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "STUDENT") {
      console.log("Not authenticated or not STUDENT, redirecting to /login");
      navigate("/login");
      return;
    }
    API.get("courses/")
      .then((res) => {
        console.log("Courses fetched:", res.data);
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("Courses error:", err.response?.data);
        setError("Failed to load courses.");
      });
  }, [navigate]);

  // Fetch modules, materials, and assessments when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      API.get(`courses/${selectedCourse.id}/modules/`)
        .then((res) => setModules(res.data))
        .catch((err) => setError("Failed to load modules."));
      API.get(`courses/${selectedCourse.id}/materials/`)
        .then((res) => setMaterials(res.data))
        .catch((err) => setError("Failed to load materials."));
      API.get(`courses/${selectedCourse.id}/assessments/`)
        .then((res) => setAssessments(res.data))
        .catch((err) => setError("Failed to load assessments."));
    }
  }, [selectedCourse]);

  // Fetch messages
  useEffect(() => {
    if (activeTab === "messages") {
      API.get("messaging/")
        .then((res) => setMessages(res.data))
        .catch((err) => setError("Failed to load messages."));
    }
  }, [activeTab]);

  // Fetch profile
  useEffect(() => {
    if (activeTab === "profile") {
      API.get("profile/")
        .then((res) => setProfile(res.data))
        .catch((err) => setError("Failed to load profile."));
    }
  }, [activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await API.post("messaging/", { recipient, content: newMessage });
      setNewMessage("");
      setRecipient("");
      API.get("messaging/").then((res) => setMessages(res.data));
    } catch (err) {
      console.error("Message error:", err.response?.data);
      setError("Failed to send message.");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("display_name", profile.display_name);
    formData.append("email", profile.email);
    if (profile.avatar) formData.append("avatar", profile.avatar);

    try {
      await API.put("profile/", formData);
      setError(null);
      localStorage.setItem("avatar", profile.avatar);
      localStorage.setItem("username", profile.display_name);
      localStorage.setItem("email", profile.email);
      alert("Profile updated!");
    } catch (err) {
      console.error("Profile error:", err.response?.data);
      setError("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    try {
      await API.post("change-password/", { old_password: oldPassword, new_password: newPassword });
      alert("Password changed!");
      e.target.reset();
    } catch (err) {
      console.error("Password error:", err.response?.data);
      setError("Failed to change password.");
    }
  };

  const handleAIQuery = async () => {
    setError("AI assistant not implemented yet.");
  };

  const handleAssessment = async (assessmentId) => {
    setError("Assessment submission not fully implemented.");
  };

  return (
    <StudentLayout>
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

      {/* Course Details */}
      {activeTab === "courses" && selectedCourse && (
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
              <h5 className="mt-3 font-medium">Materials</h5>
              {materials
                .filter((m) => m.module_id === module.id)
                .map((material) => (
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
              <h5 className="mt-3 font-medium">Assessments</h5>
              {assessments
                .filter((a) => a.module_id === module.id)
                .map((assessment) => (
                  <div key={assessment.id} className="mt-2">
                    <p>{assessment.title} - Score: {assessment.score || "Not graded"}</p>
                    <button
                      onClick={() => handleAssessment(assessment.id)}
                      className="mt-1 py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Take Assessment
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <form onSubmit={handleSendMessage} className="mb-6 space-y-3">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient (username or email)"
              className="w-full p-3 border rounded-lg"
              required
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border rounded-lg"
              rows="4"
              required
            />
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
          <div>
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-white rounded-lg shadow mb-3">
                <p><strong>{msg.sender}</strong>: {msg.content}</p>
                <p className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
            <input
              type="text"
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="Display Name"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfile({ ...profile, avatar: e.target.files[0] })}
              className="w-full p-3 border rounded-lg"
            />
            {profile.avatar && (
              <img
                src={typeof profile.avatar === "string" ? profile.avatar : URL.createObjectURL(profile.avatar)}
                alt="Avatar"
                className="w-24 h-24 rounded-full mt-2"
              />
            )}
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
          <form onSubmit={handleChangePassword} className="mt-6 space-y-4 max-w-md">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full p-3 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Change Password
            </button>
          </form>
        </div>
      )}

      {/* AI Assistant Tab */}
      {activeTab === "ai" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
          <p className="text-gray-600 mb-4">Ask questions or get study help (coming soon).</p>
          <button
            onClick={handleAIQuery}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ask AI
          </button>
        </div>
      )}

      {/* Sticky Notes */}
      <div className="fixed bottom-4 right-4 w-64 bg-yellow-100 p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Sticky Notes</h3>
        <p className="text-sm">Complete Module 1 assessment by Monday!</p>
        <p className="text-sm">New material in Web Dev course.</p>
        <p className="text-sm">Message lecturer for clarification.</p>
      </div>
    </StudentLayout>
  );
}
