// src/services/auth.js
// ---------- TOKEN HELPERS ----------
export const getAccessToken = () => localStorage.getItem("access") || null;
export const getRefreshToken = () => localStorage.getItem("refresh") || null;
export const getRole = () => localStorage.getItem("role") || null;
export const isAuthenticated = () => !!getAccessToken();

// ---------- SAVE / LOGOUT ----------
export const saveTokens = ({ access, refresh, role }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  if (role) localStorage.setItem("role", role);
};

export const logout = () => {
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
};