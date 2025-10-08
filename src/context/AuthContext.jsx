import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProfile } from "../services/api";
import { getAccessToken, getRole, logout } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Load profile only for authenticated users and non-public routes
  useEffect(() => {
    const publicRoutes = ["/login", "/forgot-password", "/register"];
    if (publicRoutes.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [location.pathname]);

  const login = (userData) => {
    setUser(userData);
    console.log("AuthContext login:", userData);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);