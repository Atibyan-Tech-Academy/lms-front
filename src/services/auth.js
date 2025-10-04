// src/services/auth.js
const TOKEN_KEY = "auth_tokens";
const ROLE_KEY = "user_role";

export const getAccessToken = () => {
  const tokens = JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}");
  return tokens.access || null;
};

export const getRefreshToken = () => {
  const tokens = JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}");
  return tokens.refresh || null;
};

export const saveTokens = (tokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY) || "GUEST";
};

export const setRole = (role) => {
  localStorage.setItem(ROLE_KEY, role);
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token; // Simple check for token presence
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  window.location.href = "/login";
};