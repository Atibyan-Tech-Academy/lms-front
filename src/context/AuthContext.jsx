// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";
import { getAccessToken, logout as authLogout } from "../services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Only fetch profile if access token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await getProfile();
        setUser(response.data || null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setUser(null);
        if (err.response?.status === 401) {
          authLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
