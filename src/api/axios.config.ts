import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    }

    // Handle unauthorized
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem("authToken");
      if (hadToken) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
