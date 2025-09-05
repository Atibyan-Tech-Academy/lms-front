import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // ✅ your axios instance
import logoLight from "../assets/Aoi2-light.png";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email / student_id / lecturer_id
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await API.post("login/", {
        identifier,
        password,
      });

      // Save tokens + role
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("role", response.data.role);

      // Redirect based on role
      if (response.data.role === "STUDENT") {
        navigate("/student");
      } else if (response.data.role === "LECTURER") {
        navigate("/instructor");
      } else if (response.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="flex h-screen m-3">
      {/* Left - Form */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>

      {/* Right - Branding */}
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
