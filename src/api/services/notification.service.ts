import api from "../axios.config";

export interface NotificationPreferences {
  waveStatusUpdated?: boolean;
  officialResponse?: boolean;
  announcement?: boolean;
  commentSurge?: boolean;
  pingCreated?: boolean;
}

const notificationService = {
  /**
   * Fetch user notification preferences
   */
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<NotificationPreferences>(
      "/users/me/notification-preferences",
    );
    return response.data;
  },

  /**
   * Update user notification preferences
   * Only sends the allowed fields to the backend
   */
  updatePreferences: async (
    prefs: NotificationPreferences,
  ): Promise<NotificationPreferences> => {
    // Only include allowed fields in the request
    const allowedFields = [
      "waveStatusUpdated",
      "officialResponse",
      "announcement",
      "commentSurge",
      "pingCreated",
    ] as const;
    const sanitized = Object.fromEntries(
      Object.entries(prefs).filter(([key]) =>
        allowedFields.includes(key as any),
      ),
    ) as NotificationPreferences;

    const response = await api.patch<NotificationPreferences>(
      "/users/me/notification-preferences",
      sanitized,
    );
    return response.data;
  },
};

export default notificationService;
