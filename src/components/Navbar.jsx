// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import logo from "../assets/aoi-portal.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/api";

const Navbar = () => {
  const { user, logout, setUser } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      // Only fetch profile on protected routes and if token and first_name are missing
      const protectedRoutes = ["/student", "/instructor", "/admin", "/editprofile"];
      if (
        user?.token &&
        !user.first_name &&
        protectedRoutes.some((route) => location.pathname.startsWith(route))
      ) {
        try {
          const response = await getProfile();
          if (isMounted && response.data) {
            setUser({ ...user, ...response.data }); // Update user data
          }
        } catch (err) {
          console.error("Failed to fetch profile in Navbar:", err);
          if (isMounted && err.response?.status !== 401) {
            setError("Failed to load profile.");
          }
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.token, location.pathname, setUser]);

  // Clear error on auth state or route change
  useEffect(() => {
    setError(null);
  }, [user?.token, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/"); // Stay on landing page after logout
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-40 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-10" alt="AOI Portal Logo" />
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user?.token ? (
            <>
              <span className="text-gray-700 dark:text-gray-300 mr-4">
                Welcome, {user?.first_name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          )}
          {error && <p className="text-red-500 text-sm ml-4">{error}</p>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;