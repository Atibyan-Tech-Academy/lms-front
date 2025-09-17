import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = localStorage.getItem("role") || "STUDENT";
  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "user@example.com";
  const avatar = localStorage.getItem("avatar") || "/docs/images/people/profile-picture-3.jpg";

  const activeTab = location.hash.slice(1) || (role === "LECTURER" ? "my-courses" : "courses");

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
          { name: "Profile", href: "#profile" },
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

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/Aoi2-light.png" className="h-8" alt="At-Tibyan LMS Logo" />
        </a>

        <div className="flex md:order-2">
          <img className="w-8 h-8 rounded-full ms-5" src={avatar} alt="User photo" />
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        <div className={`items-center justify-between ${mobileMenuOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:order-1`} id="navbar-search">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {getMenuItems().map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`block py-2 px-3 ${item.href === `#${activeTab}`
                    ? "text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    : "text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                onClick={handleLogout}
                className="block py-2 px-3 text-red-600 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;