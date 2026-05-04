import { create } from 'zustand';
import type { AppNotification } from '../../api/types';
import notificationService from '../../api/services/notification.service';

const MAX_TOASTS = 5;

interface NotificationState {
  unreadCount: number;
  toastQueue: AppNotification[];
  notifications: AppNotification[];
  isLoadingFeed: boolean;

  // Toast / badge actions
  incrementUnread: () => void;
  resetUnread: () => void;
  pushToast: (notification: AppNotification) => void;
  dismissToast: (id: AppNotification['id']) => void;

  // Feed actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: AppNotification['id']) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  toastQueue: [],
  notifications: [],
  isLoadingFeed: false,

  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  resetUnread: () => set({ unreadCount: 0 }),

  pushToast: (notification) =>
    set((state) => ({
      toastQueue: [...state.toastQueue.slice(-(MAX_TOASTS - 1)), notification],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toastQueue: state.toastQueue.filter((t) => t.id !== id),
    })),

  fetchNotifications: async () => {
    set({ isLoadingFeed: true });
    try {
      const data = await notificationService.getNotifications();
      const unread = data.filter((n) => !n.isRead).length;
      set({ notifications: data, unreadCount: unread });
    } catch (err) {
      console.error('[NotificationStore] Failed to fetch notifications:', err);
    } finally {
      set({ isLoadingFeed: false });
    }
  },

  markAsRead: async (id) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('[NotificationStore] Failed to mark as read:', err);
      // Revert on failure
      get().fetchNotifications();
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('[NotificationStore] Failed to mark all as read:', err);
      get().fetchNotifications();
    }
  },
}));
