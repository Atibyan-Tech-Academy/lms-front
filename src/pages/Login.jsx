// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { login } from "../services/api";
import { logout } from "../services/auth";
import logoLight from "../assets/Aoi2-light.png";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginData = { identifier, password };
      console.log("Sending login request:", loginData);
      const response = await API.post("accounts/login/", loginData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Login response:", response.data);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("role", response.data.role);

      if (response.data.user) {
        const user = response.data.user;
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

      if (response.data.role === "STUDENT") {
        console.log("Redirecting to /student/dashboard"); // Updated
        navigate("/student/dashboard");
      } else if (response.data.role === "LECTURER") {
        console.log("Redirecting to /instructor/dashboard"); // Updated
        navigate("/instructor/dashboard");
      } else if (response.data.role === "ADMIN") {
        console.log("Redirecting to /admin/dashboard"); // Updated
        navigate("/admin/dashboard");
      } else {
        console.log("Redirecting to /");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        request: err.config?.data,
      });
      if (err.response?.status === 401) {
        setError("Invalid credentials. Check your email/ID or password.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access this resource.");
      } else if (err.message.includes("Network Error")) {
        setError("Cannot reach backend. Is Django running on http://127.0.0.1:8000?");
      } else {
        setError("Login failed: " + (err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || JSON.stringify(err.response?.data) || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen m-3">
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email / Student ID / Lecturer ID</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or ID"
              className="mb-3 w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <div className="w-1/2 bg-blue-900 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <img
            src={logoLight}
            alt="AT-TIBYAN TECH ACADEMY"
            className="rounded-xl shadow-lg mb-6 mx-auto"
          />
          <h1 className="text-2xl font-bold">AT-TIBYAN TECH ACADEMY</h1>
          <p className="mt-2 text-lg">
            Transform Your Career with At-Tibyan Tech Academy
          </p>
        </div>
      </div>
    </div>
  );
}
