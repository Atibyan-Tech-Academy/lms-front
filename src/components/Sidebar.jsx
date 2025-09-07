import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // 👈 read from login
  const displayName = localStorage.getItem("display_name") || "User";

  // Define menus for each role
  const menus = {
    STUDENT: [
      { name: "Dashboard", path: "/student" },
      { name: "Courses", path: "/student/courses" },
      { name: "Assignments", path: "/student/assignments" },
      { name: "Messages", path: "/student/messages" },
      { name: "Profile", path: "/profile" },
    ],
    LECTURER: [
      { name: "Dashboard", path: "/instructor" },
      { name: "My Classes", path: "/instructor/classes" },
      { name: "Submissions", path: "/instructor/submissions" },
      { name: "Messages", path: "/instructor/messages" },
      { name: "Profile", path: "/profile" },
    ],
    ADMIN: [
      { name: "Dashboard", path: "/admin" },
      { name: "Users", path: "/admin/users" },
      { name: "Courses", path: "/admin/courses" },
      { name: "Reports", path: "/admin/reports" },
      { name: "Profile", path: "/profile" },
    ],
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-4 text-xl font-bold text-center border-b">
        LMS Portal
      </div>

      {/* User Info */}
      <div className="p-4 border-b text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <p className="mt-2 text-sm font-medium">{displayName}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menus[role]?.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
