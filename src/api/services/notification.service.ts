import api from "../axios.config";
import type { AppNotification } from '../types';

export interface NotificationPreferences {
  // Existing admin-driven events
  waveStatusUpdated?: boolean;
  officialResponse?: boolean;
  announcement?: boolean;
  commentSurge?: boolean;
  pingCreated?: boolean;
  // New social / peer-to-peer events
  newWaveOnPing?: boolean;
  newCommentOnPost?: boolean;
  pingSurgedMilestone?: boolean;
  commentReply?: boolean;
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
      "newWaveOnPing",
      "newCommentOnPost",
      "pingSurgedMilestone",
      "commentReply",
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

  /**
   * Fetch the VAPID public key from the backend.
   * Used to encrypt the PushManager subscription.
   */
  getVapidPublicKey: async (): Promise<{ publicKey: string }> => {
    const response = await api.get<{ publicKey: string }>(
      "/notifications/push/vapid-public-key",
    );
    return response.data;
  },

  /**
   * Register a PushSubscription with the backend so it can send pushes.
   * Call this after a successful PushManager.subscribe().
   */
  subscribePush: async (subscription: PushSubscription): Promise<void> => {
    await api.post("/notifications/push/subscribe", subscription.toJSON());
  },

  /**
   * Remove a PushSubscription from the backend.
   * Call this on logout so the user stops receiving pushes on this device.
   */
  unsubscribePush: async (endpoint: string): Promise<void> => {
    await api.delete("/notifications/push/unsubscribe", {
      data: { endpoint },
    });
  },

  /**
   * Fetch the user's notification history (paginated).
   */
  getNotifications: async (page = 1, limit = 20): Promise<AppNotification[]> => {
    const response = await api.get<{ data: AppNotification[] }>("/notifications", {
      params: { page, limit },
    });
    const rawList = Array.isArray(response.data) ? response.data : (response.data.data ?? []);
    return rawList.map((item: any) => ({
      ...item,
      isRead: Boolean(item.readAt) || Boolean(item.isRead),
    }));
  },

  /**
   * Mark a single notification as read.
   * Call this when the user clicks a notification in the feed.
   */
  markAsRead: async (id: AppNotification['id']): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },
};

export default notificationService;
