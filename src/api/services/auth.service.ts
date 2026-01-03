import api from "../axios.config";
import type { User } from "../types";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  level?: number;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface OrganizationWaitlistRequest {
  email: string;
  organizationName: string;
  message: string;
}

/**
 * Authentication Service
 * Handles user registration, login, email verification, and password management
 */
const authService = {
  /**
   * Register a new user account
   * @param data User registration details
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/users/register", data);
    return response.data;
  },

  /**
   * Login with email and password
   * @param data Login credentials
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/users/login", data);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  },

  /**
   * Authenticate with Google OAuth
   * @param data Google ID token
   */
  googleAuth: async (data: GoogleAuthRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/google", data);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  },

  /**
   * Verify email address with token
   * @param data Verification token from email
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      "/users/verify-email",
      data
    );
    return response.data;
  },

  /**
   * Request password reset email
   * @param data User email
   */
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      "/users/forgot-password",
      data
    );
    return response.data;
  },

  /**
   * Reset password with token from email
   * @param data Reset token and new password
   */
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<MessageResponse> => {
    const response = await api.patch<MessageResponse>(
      "/users/reset-password",
      data
    );
    return response.data;
  },

  /**
   * Request new organization onboarding
   * @param data Organization waitlist request
   */
  organizationWaitlist: async (
    data: OrganizationWaitlistRequest
  ): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      "/users/organization-waitlist",
      data
    );
    return response.data;
  },

  /**
   * Logout user (clear token)
   */
  logout: () => {
    localStorage.removeItem("authToken");
  },

  /**
   * Get stored auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },
};

export default authService;
