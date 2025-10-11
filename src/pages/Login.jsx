// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin, getCsrfToken, saveTokens } from "../services/api"; // Confirmed import
import logoLight from "../assets/Aoi2-light.png";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    try {
      console.log("Attempting login with:", { identifier: trimmedIdentifier, password: trimmedPassword });

      const csrfToken = await getCsrfToken();
      console.log("CSRF Token:", csrfToken || "Not fetched");

      const response = await apiLogin(
        { identifier: trimmedIdentifier, password: trimmedPassword },
        csrfToken
      );
      const { access, refresh, user: userData, role } = response.data;

      console.log("Login successful:", { role, userData });

      // Ensure userData has a role and normalize it
      userData.role = (role || userData.role || userData.profile?.role || "").toUpperCase();
      login(userData);

      // Save tokens and user data
      saveTokens({
        access,
        refresh,
        user: userData,
      });

      // Navigate based on role
      switch (userData.role) {
        case "STUDENT":
          navigate("/student/dashboard", { replace: true });
          break;
        case "LECTURER":
          navigate("/instructor/dashboard", { replace: true });
          break;
        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          console.warn("Unknown role, redirecting to home:", userData.role);
          navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      console.log("Server response:", JSON.stringify(err.response?.data, null, 2));
      if (err.response?.status === 400) {
        setError("Invalid identifier or password. Please check your credentials.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please check your credentials or clear browser data.");
      } else if (err.response?.status === 403) {
        setError("Permission denied. Ensure CSRF token is valid or contact support.");
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
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Welcome Back</h2>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Email, Username, Student ID, or Lecturer ID
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter identifier"
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link to="/forgotpassword" className="text-blue-500 hover:underline">Forgot Password?</Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-3 bg-green-800 text-white rounded-lg hover:bg-green-600 transition dark:bg-green-900 dark:hover:bg-green-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
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