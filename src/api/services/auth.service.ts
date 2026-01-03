import api from "../axios.config";
import type {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from "../types";

/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */
const authService = {
  /**
   * Login user with email and password
   * @param credentials User login credentials
   * @returns Auth response with user data and token
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    
    return response.data;
  },

  /**
   * Register new user account
   * @param userData New user registration data
   * @returns Auth response with user data and token
   */
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", userData);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    
    return response.data;
  },

  /**
   * Logout current user
   * Clears token and redirects to login
   */
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      // Always clear token and redirect, even if API call fails
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
  },

  /**
   * Get current authenticated user
   * @returns Current user data
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  /**
   * Refresh authentication token
   * @returns New auth token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>("/auth/refresh");
    
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    
    return response.data;
  },

  /**
   * Request password reset email
   * @param email User's email address
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  /**
   * Reset password with token
   * @param token Password reset token
   * @param newPassword New password
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post("/auth/reset-password", { token, newPassword });
  },

  /**
   * Verify email with verification token
   * @param token Email verification token
   */
  verifyEmail: async (token: string): Promise<void> => {
    await api.post("/auth/verify-email", { token });
  },

  /**
   * Check if user is authenticated
   * @returns True if valid token exists
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  /**
   * Get stored auth token
   * @returns Auth token or null
   */
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },
};

export default authService;
