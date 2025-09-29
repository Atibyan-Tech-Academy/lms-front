<<<<<<< Updated upstream
=======
// src/services/auth.js

export const saveTokens = ({ access, refresh, role }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  if (role) localStorage.setItem("role", role);
  console.log("Tokens saved:", { access: !!access, refresh: !!refresh, role });
};

export const getAccessToken = () => {
  const token = localStorage.getItem("access");
  console.log("getAccessToken:", token ? "Token exists" : "No token");
  return token;
};

export const getRefreshToken = () => {
  const token = localStorage.getItem("refresh");
  console.log("getRefreshToken:", token ? "Token exists" : "No token");
  return token;
};

export const getRole = () => {
  const role = localStorage.getItem("role");
  console.log("getRole:", role || "No role");
  return role;
};

export const isAuthenticated = () => {
  const isAuth = !!getAccessToken();
  console.log("isAuthenticated:", isAuth);
  return isAuth;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  console.log("Logged out");
};
>>>>>>> Stashed changes
