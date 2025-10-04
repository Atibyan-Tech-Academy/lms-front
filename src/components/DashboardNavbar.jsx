import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import image from "../assets/aoi-portal.png";
import { useAuth } from "../context/AuthContext";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // ✅ Use AuthContext
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeTab =
    location.pathname.split("/").pop() ||
    (user.role === "LECTURER" ? "my-courses" : "courses");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getMenuItems = () => {
    switch (user.role) {
      case "STUDENT":
        return [
          { name: "Courses", to: "/student/dashboard#courses" },
          { name: "Announcements", to: "/student/dashboard#announcements" },
          { name: "Notes", to: "/student/dashboard#notes" },
        ];
      case "LECTURER":
        return [
          { name: "My Courses", to: "/instructor/my-courses" },
          { name: "Announcements", to: "/instructor/dashboard#announcements" },
          { name: "Profile", to: "/editprofile" },
        ];
      case "ADMIN":
        return [
          { name: "Users", to: "/admin/dashboard#users" },
          { name: "Courses", to: "/admin/dashboard#courses" },
          { name: "Announcements", to: "/admin/dashboard#announcements" },
        ];
      default:
        return [];
    }
  };

  // 🔹 Fallback initials if no avatar
  const getInitials = () => {
    if (user.first_name || user.last_name) {
      return `${user.first_name?.charAt(0) || ""}${
        user.last_name?.charAt(0) || ""
      }`.toUpperCase();
    }
    return user.username?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={image} className="h-8" alt="At-Tibyan LMS Logo" />
        </Link>

        {/* Avatar + Dropdown + Mobile Menu */}
        <div className="flex md:order-2 items-center gap-3 relative">
          {/* Avatar Button */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open user menu</span>
            {user.avatar ? (
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={user.avatar}
                alt="User Avatar"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {getInitials()}
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.username}
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <Link
                    to="/editprofile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Edit Profile
                  </Link>
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

          {/* Mobile Hamburger */}
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

        {/* Nav Links */}
        <div
          className={`items-center justify-between ${
            mobileMenuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-search"
        >
          <ul className="flex flex-col gap-4 p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {getMenuItems().map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={`block py-2 px-3 ${
                    location.pathname === item.to
                      ? "text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
