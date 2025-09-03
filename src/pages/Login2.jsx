import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("login/", form);

      // save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // get user profile to know role
      const profile = await API.get("profile/");
      localStorage.setItem("role", profile.data.role);

      if (profile.data.role === "STUDENT") {
        navigate("/student");
      } else if (profile.data.role === "INSTRUCTOR") {
        navigate("/instructor");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          name="identifier"
          placeholder="Student ID / Lecturer ID / Email"
          value={form.identifier}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}