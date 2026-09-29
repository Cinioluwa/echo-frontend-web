import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket } from '../api/socket';
import { useNotificationStore } from '../stores/ui/useNotificationStore';
import type { AppNotification } from '../api/types';

/**
 * Pages where toast banners should be suppressed because the user
 * is already viewing a notification-dense context.
 */
const QUIET_PATHS = ['/notifications'];

/**
 * Listens for `notification:new` events on the existing WebSocket connection
 * and updates the notification badge + toast queue.
 *
 * Call this hook once inside Layout.tsx so it's always active while the
 * user is logged in.
 */
export function useNotificationSocket() {
  const location = useLocation();
  const { incrementUnread, pushToast } = useNotificationStore();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (notification: AppNotification) => {
      incrementUnread();

      // Play notification chime
      try {
        const audio = new Audio('/sounds/sonar-ping.mp3');
        audio.volume = 0.6;
        audio.play().catch(() => {
          // Autoplay blocked by browser before user gesture - ignore safely
        });
      } catch {
        // Audio playback unavailable - ignore safely
      }

      const isQuietPage = QUIET_PATHS.some((path) =>
        location.pathname.startsWith(path)
      );

      if (!isQuietPage) {
        pushToast(notification);
      }
    };

    socket.on('notification:new', handler);

    return () => {
      socket.off('notification:new', handler);
    };
  }, [location.pathname, incrementUnread, pushToast]);
}
