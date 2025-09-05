import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email or student/lecturer ID
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
        identifier,
        password,
      });

      // Save token and role in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Redirect based on role
      if (response.data.role === "STUDENT") {
        navigate("/student");
      } else if (response.data.role === "INSTRUCTOR") {
        navigate("/instructor");
      } else if (response.data.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (err) {
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left - Form */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email / ID</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or student/lecturer ID"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500"
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
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>

      {/* Right - Image/Branding */}
      <div className="w-1/2 bg-blue-900 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <img
            src="/login-side.jpg" // put your image in public folder
            alt="AT-TIBYAN TECH ACADEMY"
            className="rounded-xl shadow-lg mb-6"
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