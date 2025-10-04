// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/api"; // Adjust path if necessary (e.g., "./services/api")

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("access") || null);

  useEffect(() => {
    const syncUserData = async () => {
      if (token) {
        try {
          const response = await getProfile();
          setUser(response.data || user);
        } catch (error) {
          console.warn("Failed to fetch profile data:", error);
        }
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access", token);
    };
    syncUserData();
  }, [user, token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  const value = {
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};