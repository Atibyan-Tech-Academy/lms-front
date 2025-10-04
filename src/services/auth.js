// src/services/auth.js
export const getAccessToken = () => localStorage.getItem("access") || null;
export const getRefreshToken = () => localStorage.getItem("refresh") || null;
export const getRole = () => localStorage.getItem("role") || null;
export const isAuthenticated = () => !!getAccessToken();
export const saveTokens = ({ access, refresh, role }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  if (role) localStorage.setItem("role", role);
};
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("student_id");
  localStorage.removeItem("lecturer_id");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("avatar");
  localStorage.removeItem("full_name");
};