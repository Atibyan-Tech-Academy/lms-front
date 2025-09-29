// src/services/api.js
import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, logout } from "./auth";

// ---------- BASE CONFIG ----------
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/accounts/",
});

<<<<<<< Updated upstream
// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
=======
// ---------- REQUEST INTERCEPTOR ----------
API.interceptors.request.use((config) => {
  // Endpoints that don't need auth
  const excludeAuth = [
    "accounts/login/",
    "accounts/refresh/",
    "courses/announcements/",
  ].includes(config.url.split("?")[0]);

  if (!excludeAuth) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
>>>>>>> Stashed changes
  }
  return config;
});

<<<<<<< Updated upstream
export default API;
=======
// ---------- RESPONSE INTERCEPTOR (AUTO REFRESH) ----------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const res = await API.post("accounts/refresh/", { refresh: refreshToken });
          const newAccess = res.data.access;

          saveTokens({ access: newAccess, refresh: refreshToken });

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest);
        } catch (err) {
          console.error("Refresh token failed", err);
          logout();
          window.location.href = "/login";
        }
      } else {
        logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ---------- AUTH ENDPOINTS ----------
export const login = async (credentials) => {
  const res = await API.post("accounts/login/", credentials);
  // Expect backend to return { access, refresh, role }
  saveTokens({
    access: res.data.access,
    refresh: res.data.refresh,
    role: res.data.role,
  });
  return res;
};

export const refresh = (refreshToken) => API.post("accounts/refresh/", { refresh: refreshToken });

// ---------- STUDENT ENDPOINTS ----------
export const getEnrolledCourses = () => API.get("courses/");
export const getCourseModules = (courseId) => API.get(`courses/${courseId}/modules/`);
export const getCourseMaterials = (courseId) => API.get(`courses/${courseId}/materials/`);
export const getCourseProgress = (courseId) => API.get(`courses/${courseId}/progress/`);
export const markAsComplete = (moduleId) => API.post("progress/", { module: moduleId, completed: true });

// ---------- INSTRUCTOR ENDPOINTS ----------
export const getInstructorCourses = () => API.get("courses/");
export const createCourse = (data) => API.post("courses/", data);
export const createModule = (courseId, data) => API.post(`courses/${courseId}/modules/`, data);
export const createMaterial = (moduleId, data) =>
  API.post(`modules/${moduleId}/materials/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getInstructorDashboard = () => API.get("courses/instructor/dashboard/");
export const createAnnouncement = (courseId, data) => API.post(`courses/${courseId}/announcements/`, data);
export const getAnnouncements = () => API.get("courses/announcements/");

// ---------- PROFILE ENDPOINTS ----------
export const getProfile = () => API.get("editprofile/profile/");
export const updateProfile = (data) =>
  API.put("editprofile/profile/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // ---------- NOTES ENDPOINTS ----------
export const getNotes = () => API.get("notes/");
export const createNote = (data) => API.post("notes/", data);
export const updateNote = (id, data) => API.put(`notes/${id}/`, data);
export const partialUpdateNote = (id, data) => API.patch(`notes/${id}/`, data);
export const deleteNote = (id) => API.delete(`notes/${id}/`);



export default API;
>>>>>>> Stashed changes
