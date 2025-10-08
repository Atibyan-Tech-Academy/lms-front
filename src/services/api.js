import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, logout } from "./auth";

// ---------- BASE CONFIG ----------
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- PUBLIC ENDPOINTS ----------
const PUBLIC_ENDPOINTS = [
  "accounts/login",
  "accounts/refresh",
  "accounts/get-csrf-token",
  "accounts/password-reset", // Fixed
  "accounts/password-reset-verify", // Fixed
  "accounts/password-reset-confirm", // Fixed
  "public-announcements",
];

// ---------- REQUEST INTERCEPTOR ----------
API.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (config.url && !config.url.startsWith("http") && !config.url.endsWith("/")) {
    config.url += "/";
  }

  return config;
});

// ---------- RESPONSE INTERCEPTOR ----------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublic &&
      !originalRequest.url?.includes("accounts/refresh")
    ) {
      originalRequest._retry = true;

      if (originalRequest._retryCount >= 1) {
        console.warn("Max refresh retries exceeded, logging out.");
        logout();
        return Promise.reject(error);
      }
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const res = await API.post("accounts/refresh/", { refresh: refreshToken });
          const newAccess = res.data.access;
          saveTokens({ access: newAccess, refresh: refreshToken });
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return API(originalRequest);
        } catch (err) {
          console.error("Refresh failed:", err);
          if (err.response?.status === 401) logout();
        }
      } else {
        console.log("No refresh token, logging out for:", originalRequest.url);
        logout();
      }
    }

    return Promise.reject(error);
  }
);

// ---------- AUTH ----------
export const getCsrfToken = async () => {
  try {
    const response = await API.get("accounts/get-csrf-token/");
    return response.data.csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};

export const login = async ({ identifier, password }, csrfToken) => {
  try {
    const headers = csrfToken ? { "X-CSRFToken": csrfToken } : {};
    const res = await API.post("accounts/login/", { identifier, password }, { headers });
    saveTokens({
      access: res.data.access,
      refresh: res.data.refresh,
      role: res.data.role,
    });
    return res;
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);
    throw error;
  }
};

export const refresh = (refreshToken) => API.post("accounts/refresh/", { refresh: refreshToken });

// ---------- PASSWORD RESET ----------
export const sendResetCode = (data, csrfToken) =>
  API.post("accounts/password-reset/", data, { headers: { "X-CSRFToken": csrfToken } });

export const verifyResetCode = (data, csrfToken) =>
  API.post("accounts/password-reset-verify/", data, { headers: { "X-CSRFToken": csrfToken } });

export const resetPassword = (data, csrfToken) =>
  API.post("accounts/password-reset-confirm/", data, { headers: { "X-CSRFToken": csrfToken } });

// ---------- PUBLIC ANNOUNCEMENTS ----------
export const getPublicAnnouncements = () => API.get("public-announcements/");

// ---------- COURSES ----------
export const getAllCourses = () => API.get("courses/courses/");
export const getCourse = (id) => API.get(`courses/courses/${id}/`);
export const createCourse = (data) => API.post("courses/courses/", data);
export const updateCourse = (id, data) => API.put(`courses/courses/${id}/`, data);
export const deleteCourse = (id) => API.delete(`courses/courses/${id}/`);
export const getCourseModules = (courseId) => API.get(`courses/modules/?course=${courseId}`);
export const getCourseMaterials = (courseId) => API.get(`courses/materials/?course=${courseId}`);

// ---------- MODULES ----------
export const getAllModules = () => API.get("courses/modules/");
export const getModule = (id) => API.get(`courses/modules/${id}/`);
export const createModule = (data) => API.post("courses/modules/", data);
export const updateModule = (id, data) => API.put(`courses/modules/${id}/`, data);
export const deleteModule = (id) => API.delete(`courses/modules/${id}/`);

// ---------- MATERIALS ----------
export const getAllMaterials = () => API.get("courses/materials/");
export const getMaterial = (id) => API.get(`courses/materials/${id}/`);
export const createMaterial = (data) =>
  API.post("courses/materials/", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateMaterial = (id, data) =>
  API.put(`courses/materials/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteMaterial = (id) => API.delete(`courses/materials/${id}/`);

// ---------- ENROLLMENTS ----------
export const getEnrollments = () => API.get("courses/enrollments/");
export const enrollStudent = (data) => API.post("courses/enrollments/", data);
export const getEnrolledCourses = () => API.get("courses/enrollments/");

// ---------- STUDENT PROGRESS ----------
export const getProgress = () => API.get("courses/progress/");
export const getCourseProgress = (courseId) => API.get(`courses/progress/?module__course=${courseId}`);
export const markAsComplete = (moduleId) => API.post("courses/progress/", { module: moduleId, completed: true });

// ---------- ANNOUNCEMENTS ----------
export const getAnnouncements = () => API.get("courses/announcements/");
export const createAnnouncement = (data) => API.post("courses/announcements/", data);
export const updateAnnouncement = (id, data) => API.put(`courses/announcements/${id}/`, data);
export const deleteAnnouncement = (id) => API.delete(`courses/announcements/${id}/`);

// ---------- INSTRUCTOR DASHBOARD ----------
export const getInstructorDashboard = () => API.get("courses/instructor/dashboard/");

// ---------- PROFILE ----------
export const getProfile = () => API.get("editprofile/profile/");
export const updateProfile = (data) => {
  const config = {};
  if (data instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  return API.put("editprofile/profile/", data, config);
};

// Export API as both default & named
export default API;
export { API };