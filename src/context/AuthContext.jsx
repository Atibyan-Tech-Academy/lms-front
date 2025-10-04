// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { getProfile, login as apiLogin, getCsrfToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    syncUserData();
  }, []);

  const syncUserData = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      setUser(null); // Clear user on 401 or other errors
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, accessToken) => {
    setUser(userData); // Update user state immediately
    localStorage.setItem("access", accessToken); // Sync with localStorage
    await syncUserData(); // Ensure profile is fetched
  };

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;