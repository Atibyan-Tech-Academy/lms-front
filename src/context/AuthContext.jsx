import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProfile, refresh } from "../services/api";
import { getAccessToken, getRefreshToken, logout, saveTokens } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
        const userData = res.data;
        userData.role = (userData.role || userData.profile?.role || "").toUpperCase();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        if (err.response?.status === 401) {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const refreshRes = await refresh({ refresh: refreshToken });
              saveTokens({ access: refreshRes.data.access, refresh: refreshToken, user: getUser() });
              const profileRes = await getProfile();
              const userData = profileRes.data;
              userData.role = (userData.role || userData.profile?.role || "").toUpperCase();
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            } catch (refreshErr) {
              logout();
              setUser(null);
            }
          } else {
            logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [location.pathname]);

  const login = (userData) => {
    userData.role = (userData.role || userData.profile?.role || "").toUpperCase();
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
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