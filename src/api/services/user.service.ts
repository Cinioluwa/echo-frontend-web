import api from "../axios.config";
import type {
  User,
  Surge,
  Comment,
  UserPreference,
  PaginatedResponse,
  PaginationParams,
} from "../types/index";

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserPreferencesRequest {
  commentAnonymously?: boolean;
  pingAnonymously?: boolean;
  anonymousAlias?: string | null; // Alias name (2-30 chars) or null to clear
  anonymousAliasProfilePicture?: string | null; // URL to profile picture or null to clear
}

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const responseError =
    typeof error === "object" && error !== null && "response" in error
      ? (error as { response?: { data?: { message?: string; error?: string } } })
      : undefined;

  const apiMessage =
    responseError?.response?.data?.message ||
    responseError?.response?.data?.error;

  if (apiMessage && apiMessage.trim().length > 0) {
    return apiMessage;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

/**
 * User Service
 * Handles user profile management and user-specific data
 */
const userService = {
  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/users/me");
    return response.data;
  },

  /**
   * Update current user profile (first name, last name only)
   * @param data Updated user information
   */
  updateMe: async (data: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<{ message: string; user: User }>(
      "/users/me",
      data,
    );
    return response.data.user;
  },

  /**
   * Delete current user account (permanent)
   */
  deleteMe: async (): Promise<void> => {
    await api.delete("/users/me");
  },

  /**
   * Get all surges (likes) by current user
   * @param params Pagination parameters
   */
  getMySurges: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Surge>> => {
    const response = await api.get<PaginatedResponse<Surge>>(
      "/users/me/surges",
      { params },
    );
    return response.data;
  },

  /**
   * Get all comments by current user
   * @param params Pagination parameters
   */
  getMyComments: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(
      "/users/me/comments",
      { params },
    );
    return response.data;
  },

  /**
   * Get current user's posting preferences
   */
  getMyPreferences: async (): Promise<UserPreference> => {
    const response = await api.get<UserPreference>("/users/me/preferences");
    return response.data;
  },

  /**
   * Update current user's posting preferences
   * @param data Updated preference fields (alias, picture, etc.)
   */
  updateMyPreferences: async (
    data: UpdateUserPreferencesRequest,
  ): Promise<UserPreference> => {
    const response = await api.patch<UserPreference>(
      "/users/me/preferences",
      data,
    );
    return response.data;
  },

  /**
   * Update the anonymous alias profile picture URL in user preferences.
   * @param imageUrl URL to save, or null to clear existing picture.
   */
  updateAnonymousAliasProfilePicture: async (
    imageUrl: string | null,
  ): Promise<UserPreference> => {
    try {
      const response = await api.patch<UserPreference>("/users/me/preferences", {
        anonymousAliasProfilePicture: imageUrl,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          imageUrl
            ? "Could not save anonymous alias picture. Please try again."
            : "Could not remove anonymous alias picture. Please try again.",
        ),
      );
    }
  },
};

export default userService;
