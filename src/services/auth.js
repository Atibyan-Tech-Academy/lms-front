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
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
};
