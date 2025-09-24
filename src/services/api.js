// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use((config) => {
  if (!["accounts/login/", "accounts/refresh/"].includes(config.url)) {
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

// Auth endpoints
export const login = (credentials) => API.post('accounts/login/', credentials);
export const refresh = (refreshToken) => API.post('accounts/refresh/', { refresh: refreshToken });

// Student endpoints
export const getEnrolledCourses = () => API.get('courses/');
export const getCourseModules = (courseId) => API.get(`courses/${courseId}/modules/`);
export const getCourseMaterials = (courseId) => API.get(`courses/${courseId}/materials/`);
export const getCourseProgress = (courseId) => API.get(`courses/${courseId}/progress/`);
export const markAsComplete = (moduleId) => API.post('progress/', { module_id: moduleId, completed: true });

// Instructor endpoints
export const getInstructorCourses = () => API.get('courses/'); // Filtered by instructor
export const createCourse = (data) => API.post('courses/', data);
export const createModule = (courseId, data) => API.post(`courses/${courseId}/modules/`, data);
export const createMaterial = (moduleId, data) => API.post(`modules/${moduleId}/materials/`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const getInstructorDashboard = () => API.get('courses/instructor/dashboard/');
export const createAnnouncement = (courseId, data) => API.post(`courses/${courseId}/announcements/`, data);


// src/services/api.js
export const getAnnouncements = () => API.get("announcements/");
export default API;