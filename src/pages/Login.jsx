// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, getCsrfToken } from "../services/api";
import logoLight from "../assets/Aoi2-light.png";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use AuthContext login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Sending login payload:", { identifier, password });

      // Fetch CSRF token
      let csrfToken = await getCsrfToken();
      if (!csrfToken) {
        console.warn("No CSRF token fetched, proceeding without it.");
      }

      const response = await apiLogin({ identifier, password }, csrfToken);
      const { access, refresh, role, user } = response.data;

      // Update AuthContext and localStorage
      login(user, access); // Sync with AuthContext
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role);

      if (user) {
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("username", user.username || "");
        localStorage.setItem("email", user.email || "");
        localStorage.setItem("student_id", user.student_id || "");
        localStorage.setItem("lecturer_id", user.lecturer_id || "");
        localStorage.setItem("first_name", user.first_name || "");
        localStorage.setItem("last_name", user.last_name || "");
        localStorage.setItem("avatar", user.profile_image || "");
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
        localStorage.setItem("full_name", fullName || user.username);
      }

      // Redirect based on role
      switch (role) {
        case "STUDENT":
          navigate("/student/dashboard");
          break;
        case "LECTURER":
          navigate("/instructor/dashboard");
          break;
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      console.log("Server response:", JSON.stringify(err.response?.data, null, 2));
      if (err.response?.status === 401) {
        setError("Invalid credentials. Check your email/ID or password.");
      } else if (err.response?.status === 403) {
        setError("Permission denied. Check backend logs or CSRF token.");
      } else if (err.message.includes("Network Error")) {
        setError("Cannot reach backend. Is Django running on http://127.0.0.1:8000?");
      } else {
        setError(
          "Login failed: " +
          (err.response?.data?.detail ||
            err.response?.data?.non_field_errors?.[0] ||
            JSON.stringify(err.response?.data) ||
            err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen m-3">
      {/* Left side form */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Welcome Back</h2>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mb-3">{error}</p>}
        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email / Username / Student ID / Lecturer ID</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or ID"
              className="mb-3 w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 mt-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition dark:bg-green-900 dark:hover:bg-green-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>

      {/* Right side image */}
      <div className="w-1/2 bg-blue-900 flex items-center justify-center bg-image">
        <div className="text-center text-white px-6">
          <img
            src={logoLight}
            alt="AT-TIBYAN TECH ACADEMY"
            className="rounded-xl shadow-lg mb-6 mx-auto"
          />
          <h1 className="text-2xl font-bold">AT-TIBYAN TECH ACADEMY</h1>
          <p className="mt-2 text-lg">Transform Your Career with At-Tibyan Tech Academy</p>
        </div>
      </div>
    </div>
  );
}