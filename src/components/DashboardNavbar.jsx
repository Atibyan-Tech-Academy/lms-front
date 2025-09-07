// src/components/DashboardNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get user data from localStorage
  const role = localStorage.getItem("role") || "STUDENT";
  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "user@example.com";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Role-based menus
  const studentMenu = [
    { name: "Dashboard", path: "/student" },
    { name: "Courses", path: "/courses" },
    { name: "Assignments", path: "/assignments" },
    { name: "Messages", path: "/messages" },
  ];

  const instructorMenu = [
    { name: "Dashboard", path: "/instructor" },
    { name: "My Courses", path: "/courses" },
    { name: "Assignments", path: "/assignments" },
    { name: "Messages", path: "/messages" },
  ];

  const adminMenu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/users" },
    { name: "Courses", path: "/courses" },
    { name: "Settings", path: "/settings" },
  ];

  let menus = [];
  if (role === "STUDENT") menus = studentMenu;
  else if (role === "LECTURER") menus = instructorMenu;
  else if (role === "ADMIN") menus = adminMenu;

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo192.png" className="h-8" alt="App Logo" />
          <span className="text-xl font-bold dark:text-white">AOI LMS</span>
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex space-x-6 font-medium">
          {menus.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            <img
              className="w-8 h-8 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
              alt="user avatar"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
