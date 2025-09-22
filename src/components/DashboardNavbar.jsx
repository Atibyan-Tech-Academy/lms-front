import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import image from "../assets/aoi-portal.png";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const role = localStorage.getItem("role") || "STUDENT";
  const username = localStorage.getItem("username") || "User";
  const avatar = localStorage.getItem("avatar"); // ✅ might be null
  const firstName = localStorage.getItem("first_name") || "";
  const lastName = localStorage.getItem("last_name") || "";
  const studentId = localStorage.getItem("student_id") || "N/A"; // ✅ student ID

  const activeTab =
    location.hash.slice(1) || (role === "LECTURER" ? "my-courses" : "courses");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getMenuItems = () => {
    switch (role) {
      case "STUDENT":
        return [
          { name: "Courses", href: "#courses" },
          { name: "Announcements", href: "#announcements" },
          { name: "Notes", href: "#notes" },
        ];
      case "LECTURER":
        return [
          { name: "My Courses", href: "#my-courses" },
          { name: "Announcements", href: "#announcements" },
          { name: "Profile", href: "#profile" },
        ];
      case "ADMIN":
        return [
          { name: "Users", href: "#users" },
          { name: "Courses", href: "#courses" },
          { name: "Announcements", href: "#announcements" },
        ];
      default:
        return [];
    }
  };

  // ✅ Helper: compute initials
  const getInitials = () => {
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return username.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={image} className="h-8" alt="At-Tibyan LMS Logo" />
        </a>

        {/* Avatar + Dropdown + Mobile Menu Toggle */}
        <div className="flex md:order-2 items-center gap-3 relative">
          {/* Avatar Button */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open user menu</span>
            {avatar ? (
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={avatar}
                alt="User Avatar"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {getInitials()}
              </div>
            )}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {firstName} {lastName}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {studentId} {/* ✅ shows Student ID instead of email */}
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#courses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    My Learning
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`items-center justify-between ${
            mobileMenuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-search"
        >
          <ul className="flex flex-col gap-4 p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {getMenuItems().map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`block py-2 px-3 ${
                    item.href === `#${activeTab}`
                      ? "text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
