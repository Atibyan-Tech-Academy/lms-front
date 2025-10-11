// src/services/auth.js
export const getAccessToken = () => localStorage.getItem("access") || null;
export const getRefreshToken = () => localStorage.getItem("refresh") || null;
export const isAuthenticated = () => !!getAccessToken();

export const saveTokens = ({ access, refresh, user }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user)); // Store full user object
    if (user.role) localStorage.setItem("role", user.role.toUpperCase()); // Sync role
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user"); // Remove full user object
  localStorage.removeItem("role"); // Remove role
  // Remove only fields that are known to be set
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("student_id");
  localStorage.removeItem("lecturer_id");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const getRole = () => {
  const user = getUser();
  return user?.role || localStorage.getItem("role") || null;
};