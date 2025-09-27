import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
});

// 🔐 Attach token unless excluded
API.interceptors.request.use((config) => {
  const excludeAuth = [
    "accounts/login/",
    "accounts/refresh/",
    "courses/announcements/",
  ].includes(config.url.split("?")[0]); // Handle query params

  if (!excludeAuth) {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Added Authorization header:", config.headers.Authorization);
    }
  } else {
    console.log("Skipped Authorization header for:", config.url);
  }
  return config;
});

// ================== AUTH ENDPOINTS ==================
export const login = (credentials) => API.post("accounts/login/", credentials);
export const refresh = (refreshToken) =>
  API.post("accounts/refresh/", { refresh: refreshToken });

// ================== STUDENT ENDPOINTS ==================
export const getEnrolledCourses = () => API.get("courses/");
export const getCourseModules = (courseId) =>
  API.get(`courses/${courseId}/modules/`);
export const getCourseMaterials = (courseId) =>
  API.get(`courses/${courseId}/materials/`);
export const getCourseProgress = (courseId) =>
  API.get(`courses/${courseId}/progress/`);
export const markAsComplete = (moduleId) =>
  API.post("progress/", { module_id: moduleId, completed: true });

// ================== INSTRUCTOR ENDPOINTS ==================
export const getInstructorCourses = () => API.get("courses/");
export const createCourse = (data) => API.post("courses/", data);
export const createModule = (courseId, data) =>
  API.post(`courses/${courseId}/modules/`, data);
export const createMaterial = (moduleId, data) =>
  API.post(`modules/${moduleId}/materials/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getInstructorDashboard = () =>
  API.get("courses/instructor/dashboard/");
export const createAnnouncement = (courseId, data) =>
  API.post(`courses/${courseId}/announcements/`, data);
export const getAnnouncements = () => API.get("courses/announcements/");

// ================== PROFILE ENDPOINTS ==================
// Fetch logged-in user's profile
export const getProfile = () => API.get("editprofile/profile/");

// Update logged-in user's profile
export const updateProfile = (data) =>
  API.put("editprofile/profile/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;
