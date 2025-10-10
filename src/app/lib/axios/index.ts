// src/lib/api.ts
import axios from "axios";
import { API_URL } from "@/constants";

console.log("🔗 Axios Base URL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log("🚀 Sending request to:", config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("⚠️ Unauthorized. Redirecting to login...");
        window.location.href = "/login";
      }

      if (status >= 500) {
        console.error("🚨 Server error:", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);
