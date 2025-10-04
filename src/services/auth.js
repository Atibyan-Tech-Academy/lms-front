// src/services/auth.js

// ---------- TOKEN HELPERS ----------
export const getAccessToken = () => {
  const token = localStorage.getItem("access");
  return token || null;
};

export const getRefreshToken = () => {
  const token = localStorage.getItem("refresh");
  return token || null;
};

export const getRole = () => {
  return localStorage.getItem("role") || null;
};

export const isAuthenticated = () => !!getAccessToken();

// ---------- SAVE / LOGOUT ----------
export const saveTokens = ({ access, refresh, role }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  if (role) localStorage.setItem("role", role);
};

export const logout = () => {
  // Clear all known auth-related keys
  const authKeys = [
    "access",
    "refresh",
    "role",
    "user_id",
    "username",
    "email",
    "student_id",
    "lecturer_id",
    "first_name",
    "last_name",
    "avatar",
    "full_name",
  ];
  authKeys.forEach((key) => localStorage.removeItem(key));

  // Optional: Clear all localStorage if other keys might exist
  // localStorage.clear(); // Uncomment if you want to clear everything
};