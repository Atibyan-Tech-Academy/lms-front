// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";
import { getAccessToken } from "../services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();

      // If no token, guest user
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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = { user, setUser, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
