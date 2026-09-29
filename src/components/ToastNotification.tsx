import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useNotificationStore } from '../stores/ui/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import type { AppNotification, NotificationType } from '../api/types';

const AUTO_DISMISS_MS = 5500;

const ICONS: Partial<Record<NotificationType, string>> = {
  NEW_WAVE_ON_PING: '🌊',
  NEW_COMMENT_ON_POST: '💬',
  PING_SURGED_MILESTONE: '🚀',
  COMMENT_REPLY: '↩️',
  COMMENT_SURGE: '⚡',
  WAVE_STATUS_UPDATED: '📋',
  WAVE_APPROVED: '✅',
  OFFICIAL_RESPONSE_POSTED: '📣',
  OFFICIAL_RESPONSE: '📣',
  ANNOUNCEMENT_POSTED: '📢',
  ANNOUNCEMENT: '📢',
  POST_REPORTED: '⚠️',
  MODERATION_WARNING: '⚠️',
  MODERATION_SUSPENSION: '🚫',
  MODERATION_BAN: '⛔',
  MODERATION_IDENTITY_DISCLOSURE_REQUESTED: '🔒',
};

// ─── Single Toast ──────────────────────────────────────────────────────────────

interface ToastItemProps {
  notification: AppNotification;
}

const ToastItem = ({ notification }: ToastItemProps) => {
  const dismissToast = useNotificationStore((s) => s.dismissToast);
  const navigate = useNavigate();

  // Auto-dismiss after timeout
  useEffect(() => {
    const t = setTimeout(
      () => dismissToast(notification.id),
      AUTO_DISMISS_MS
    );
    return () => clearTimeout(t);
  }, [notification.id, dismissToast]);

  const handleClick = () => {
    dismissToast(notification.id);
    if (notification.url) {
      navigate(notification.url);
    }
  };

  return (
    <div
      id={`toast-notification-${notification.id}`}
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 bg-white border border-[#FFC37B] rounded-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-3 w-[300px] cursor-pointer
        animate-slide-in hover:shadow-[0_4px_24px_rgba(0,0,0,0.18)]
        transition-shadow duration-200"
      onClick={handleClick}
    >
      {/* Icon */}
      <span className="text-xl leading-none mt-0.5 shrink-0">
        {ICONS[notification.type] ?? '🔔'}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13px] text-[#4A3728] truncate font-['Poppins',sans-serif]">
          {notification.title}
        </p>
        <p className="text-[11px] text-[#7D7D7D] line-clamp-2 leading-snug font-['Poppins',sans-serif]">
          {notification.body}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          dismissToast(notification.id);
        }}
        className="shrink-0 text-[#CECECE] hover:text-[#7D7D7D] transition-colors -mt-0.5"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Toast Stack ──────────────────────────────────────────────────────────────

/**
 * ToastNotification
 * Renders a floating stack of toast banners in the bottom-right corner.
 * Render this once inside Layout.tsx — it is self-managing via the store.
 */
const ToastNotification = () => {
  const toastQueue = useNotificationStore((s) => s.toastQueue);
  if (toastQueue.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
      aria-label="Notification toasts"
    >
      {toastQueue.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <ToastItem notification={notification} />
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
