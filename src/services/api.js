// src/services/api.js
import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, logout } from "./auth";

// ---------- BASE CONFIG ----------
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  withCredentials: true,
});

// ---------- REQUEST INTERCEPTOR ----------
API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.url && !config.url.startsWith("http") && !config.url.endsWith("/")) {
    config.url += "/";
  }
  return config;
});

// ---------- RESPONSE INTERCEPTOR (AUTO REFRESH) ----------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
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
  saveTokens({
    access: res.data.access,
    refresh: res.data.refresh,
    role: res.data.role,
  });
  return res;
};

export const refresh = (refreshToken) => API.post("accounts/refresh/", { refresh: refreshToken });

// ---------- COURSES ENDPOINTS ----------
export const getAllCourses = () => API.get("courses/");
export const getCourse = (id) => API.get(`courses/${id}/`);
export const createCourse = (data) => API.post("courses/", data);
export const updateCourse = (id, data) => API.put(`courses/${id}/`, data);
export const deleteCourse = (id) => API.delete(`courses/${id}/`);

// ---------- MODULES ----------
export const getAllModules = () => API.get("modules/");
export const getModule = (id) => API.get(`modules/${id}/`);
export const createModule = (data) => API.post("modules/", data);
export const updateModule = (id, data) => API.put(`modules/${id}/`, data);
export const deleteModule = (id) => API.delete(`modules/${id}/`);

// ---------- MATERIALS ----------
export const getAllMaterials = () => API.get("materials/");
export const getMaterial = (id) => API.get(`materials/${id}/`);
export const createMaterial = (data) =>
  API.post("materials/", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateMaterial = (id, data) =>
  API.put(`materials/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteMaterial = (id) => API.delete(`materials/${id}/`);

// ---------- ENROLLMENTS ----------
export const getEnrollments = () => API.get("enrollments/");
export const enrollStudent = (data) => API.post("enrollments/", data);

// ---------- STUDENT PROGRESS ----------
export const getProgress = () => API.get("progress/");
export const markAsComplete = (moduleId) => API.post("progress/", { module: moduleId, completed: true });

// ---------- ANNOUNCEMENTS ----------
export const getAnnouncements = () => API.get("announcements/");
export const createAnnouncement = (data) => API.post("announcements/", data);
export const updateAnnouncement = (id, data) => API.put(`announcements/${id}/`, data);
export const deleteAnnouncement = (id) => API.delete(`announcements/${id}/`);

// ---------- INSTRUCTOR DASHBOARD ----------
export const getInstructorDashboard = () => API.get("instructor/dashboard/");

// ---------- PROFILE ----------
export const getProfile = () => API.get("editprofile/profile/");
export const updateProfile = (data) => {
  const config = {};
  if (data instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  return API.put("editprofile/profile/", data, config);
};

export default API;
