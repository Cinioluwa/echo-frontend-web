import api from "../axios.config";
import type { User } from "../types/index";

/**
 * Change current user password
 * @param currentPassword Current password
 * @param newPassword New password
 */

const passwordService = {
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<User> => {
    const response = await api.patch<User>("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Request password reset email
   * @param email User email
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post("/users/forgot-password", { email });
  },

  /**
   * Reset password with token
   * @param token Reset token from email
   * @param newPassword New password
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.patch("/users/reset-password", { token, newPassword });
  },
};

export default passwordService;
