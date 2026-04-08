import api from "../axios.config";
import type {
  User,
  Surge,
  Comment,
  PaginatedResponse,
  PaginationParams,
} from "../types/index";

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

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
};

export default userService;
