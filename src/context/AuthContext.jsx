// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";
import { getAccessToken, getRole, logout } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile if token exists (no logout on failure)
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // Don't logout on profile fetch failure - just set user to null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    console.log("AuthContext login:", userData); // Debug log
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