// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/accounts/",
});

API.interceptors.request.use((config) => {
  if (!["login/", "refresh/"].includes(config.url)) {
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

export default API;