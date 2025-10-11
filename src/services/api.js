import axios from "axios";
import { getAccessToken, getRefreshToken, logout, getUser } from "./auth";

export const saveTokens = ({ access, refresh, user }) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.role) localStorage.setItem("role", user.role.toUpperCase());
  }
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINTS = [
  "accounts/login/",
  "accounts/refresh/",
  "accounts/get-csrf-token/",
  "accounts/password-reset/",
  "accounts/password-reset-verify/",
  "accounts/password-reset-confirm/",
  "public-announcements/",
];

API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url?.endsWith(endpoint)
    );
    if (token && !isPublic) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (config.url && !config.url.startsWith("http") && !config.url.endsWith("/")) {
      config.url += "/";
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest?.url?.endsWith(endpoint)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublic &&
      !originalRequest.url?.includes("accounts/refresh/")
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount > 1) {
        console.warn("Max refresh retries exceeded, logging out.");
        logout();
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const res = await API.post("accounts/refresh/", { refresh: refreshToken });
          const newAccess = res.data.access;
          saveTokens({ access: newAccess, refresh: refreshToken, user: getUser() });
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return API(originalRequest);
        } catch (err) {
          console.error("Refresh token failed:", err);
          if (err.response?.status === 401) logout();
          return Promise.reject(err);
        }
      } else {
        console.log("No refresh token, logging out for:", originalRequest.url);
        logout();
      }
    } else if (error.response?.status === 403) {
      console.error("Forbidden access:", error.response.data);
    }
    return Promise.reject(error);
  }
);

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
    console.log("Sending login request:", { identifier, password });
    const headers = csrfToken ? { "X-CSRFToken": csrfToken } : {};
    const res = await API.post("accounts/login/", { identifier, password }, { headers });
    console.log("Login response:", res.data);
    saveTokens({
      access: res.data.access,
      refresh: res.data.refresh,
      user: res.data.user,
    });
    return res;
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);
    throw error;
  }
};

export const refresh = (refreshToken) => API.post("accounts/refresh/", { refresh: refreshToken });

export const sendResetCode = (data, csrfToken) =>
  API.post("accounts/password-reset/", data, { headers: { "X-CSRFToken": csrfToken } });

export const verifyResetCode = (data, csrfToken) =>
  API.post("accounts/password-reset-verify/", data, { headers: { "X-CSRFToken": csrfToken } });

export const resetPassword = (data, csrfToken) =>
  API.post("accounts/password-reset-confirm/", data, { headers: { "X-CSRFToken": csrfToken } });

export const getPublicAnnouncements = () => API.get("public-announcements/");

export const getAllUsers = () => API.get("accounts/users/");

export const getAllCourses = () => API.get("courses/courses/");
export const getCourse = (id) => API.get(`courses/courses/${id}/`);
export const createCourse = (data) =>
  API.post("courses/courses/", data, {
    headers: { "Content-Type": "application/json" },
  });
export const updateCourse = (id, data) => API.put(`courses/courses/${id}/`, data);
export const deleteCourse = (id) => API.delete(`courses/courses/${id}/`);
export const getCourseModules = (courseId) => API.get(`courses/modules/?course=${courseId}`);
export const getCourseMaterials = (courseId) => API.get(`courses/materials/?course=${courseId}`);

export const getAllModules = () => API.get("courses/modules/");
export const getModule = (id) => API.get(`courses/modules/${id}/`);
export const createModule = (data) => API.post("courses/modules/", data);
export const updateModule = (id, data) => API.put(`courses/modules/${id}/`, data);
export const deleteModule = (id) => API.delete(`courses/modules/${id}/`);

export const getAllMaterials = () => API.get("courses/materials/");
export const getMaterial = (id) => API.get(`courses/materials/${id}/`);
export const createMaterial = (data) =>
  API.post("courses/materials/", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateMaterial = (id, data) =>
  API.put(`courses/materials/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteMaterial = (id) => API.delete(`courses/materials/${id}/`);

export const getEnrollments = () => API.get("courses/enrollments/");
export const enrollStudent = (data) => API.post("courses/enrollments/", data);
export const getEnrolledCourses = () => API.get("courses/enrollments/");

export const getProgress = () => API.get("courses/progress/");
export const getCourseProgress = (courseId) => API.get(`courses/progress/?module__course=${courseId}`);
export const markAsComplete = (moduleId) => API.post("courses/progress/", { module: moduleId, completed: true });

export const getAnnouncements = () => API.get("courses/announcements/");
export const createAnnouncement = (data) => API.post("courses/announcements/", data);
export const updateAnnouncement = (id, data) => API.put(`courses/announcements/${id}/`, data);
export const deleteAnnouncement = (id) => API.delete(`courses/announcements/${id}/`);

export const getInstructorDashboard = () => API.get("courses/instructor/dashboard/");

export const getProfile = () => API.get("accounts/profile/");
export const updateProfile = (data) => {
  const config = {};
  if (data instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  return API.put("editprofile/profile/", data, config);
};

// Notes Endpoints
export const getNotes = () => API.get("notes/notes/");
export const createNote = (data) => API.post("notes/notes/", data);
export const updateNote = (id, data) => API.put(`notes/notes/${id}/`, data);
export const deleteNote = (id) => API.delete(`notes/notes/${id}/`);

// AI Chat Endpoints
export const getAIChatHistory = () => API.get("ai-chat/");
export const sendAIChatMessage = (data) => API.post("ai-chat/", data);

// Optional: Human Chat Endpoints
export const getMessages = (roomId) => API.get(`messaging/${roomId}/`);
export const sendMessage = (roomId, data) => API.post(`messaging/${roomId}/`, data);

export default API;
export { API };