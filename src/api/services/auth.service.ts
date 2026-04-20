import api from "../axios.config";
import type {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  OrganizationWaitlistRequest,
  ResendVerificationRequest,
  ResendVerificationResponse,
} from "../types/index";

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
    const response = await api.post<AuthResponse>("/users/login", credentials);

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  /**
   * Authenticate with Google OAuth
   * @param googleToken Google ID token
   * @returns Auth response with user data and token
   */
  googleAuth: async (googleToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/google", {
      token: googleToken,
    });

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  /**
   * Register new user account
   * @param userData New user registration data
   * @returns Auth response with user data
   */
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/register", userData);

    // Note: Token might not be included if email verification is required
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  /**
   * Verify email with verification token
   * @param token Email verification token from URL
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>(
        "/users/verify-email",
        { token },
      );
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;

      // Backward compatibility for older GET-only verification handlers.
      if (status === 404 || status === 405) {
        const response = await api.get<{ message: string }>(
          `/users/verify-email?token=${token}`,
        );
        return response.data;
      }

      throw error;
    }
  },

  /**
   * Resend verification email
   * @param payload Email and optional organization for personal domains
   */
  resendVerification: async (
    payload: ResendVerificationRequest,
  ): Promise<ResendVerificationResponse> => {
    const response = await api.post<ResendVerificationResponse>(
      "/users/resend-verification",
      payload,
    );
    return response.data;
  },

  /**
   * Request password reset email
   * @param email User's email address
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/users/forgot-password",
      { email },
    );
    return response.data;
  },

  /**
   * Reset password with token
   * @param token Password reset token
   * @param newPassword New password
   */
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>(
      "/users/reset-password",
      {
        token,
        newPassword,
      },
    );
    return response.data;
  },

  /**
   * Request new organization onboarding
   * @param data Organization waitlist request data
   */
  joinOrganizationWaitlist: async (
    data: OrganizationWaitlistRequest,
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/users/organization-waitlist",
      data,
    );
    return response.data;
  },

  /**
   * Logout current user
   * Clears token and redirects to login
   */
  logout: (): void => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  },

  /**
   * Get current authenticated user
   * @returns Current user data
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/users/me");
    return response.data;
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
