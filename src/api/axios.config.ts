import axios from "axios";
import { parseNetworkError, NetworkErrorType } from "../utils/networkUtils";

// API Base URL for both HTTP and WebSocket connections
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000/api";
// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track token expiration status
let isTokenExpired = false;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Let the browser set the multipart boundary for FormData payloads.
    // Keeping the default JSON content-type here causes file uploads to fail.
    if (config.data instanceof FormData) {
      const headers = config.headers as Record<string, unknown>;
      delete headers["Content-Type"];
      delete headers["content-type"];
    }

    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Parse network error
    const networkError = parseNetworkError(error);

    // Handle different error types
    switch (networkError.type) {
      case NetworkErrorType.RATE_LIMITED:
        console.error("Rate limit exceeded. Please try again later.");
        break;

      case NetworkErrorType.UNAUTHORIZED:
        // Only handle token expiration once to avoid loops
        if (!isTokenExpired) {
          isTokenExpired = true;
          const hadToken = !!localStorage.getItem("authToken");

          if (hadToken) {
            // Clear token
            localStorage.removeItem("authToken");

            // Show user-friendly message
            console.error("Your session has expired. Please log in again.");

            // Redirect to login after a brief delay to allow error display
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
        }
        break;

      case NetworkErrorType.OFFLINE:
        console.error(
          "Network connection lost. Please check your internet connection.",
        );
        break;

      case NetworkErrorType.TIMEOUT:
        console.error("Request timed out. Please try again.");
        break;

      case NetworkErrorType.SERVER_ERROR:
        console.error("Server error occurred. Please try again later.");
        break;
    }

    return Promise.reject(error);
  },
);

// Reset token expiration flag when a new token is stored
const originalSetItem = localStorage.setItem;
localStorage.setItem = function (key: string, value: string) {
  if (key === "authToken") {
    isTokenExpired = false;
  }
  originalSetItem.apply(this, [key, value]);
};

export default api;
