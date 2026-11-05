import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../stores/ui/useNotificationStore';

/**
 * NotificationBell
 * Bell icon with an animated unread count badge.
 * Clicking resets the badge and navigates to /notifications.
 */
const NotificationBell = () => {
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const resetUnread = useNotificationStore((s) => s.resetUnread);

  const handleClick = () => {
    resetUnread();
    navigate('/notifications');
  };

  return (
    <button
      id="notification-bell"
      onClick={handleClick}
      className="relative p-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
      aria-label={
        unreadCount > 0
          ? `Notifications (${unreadCount} unread)`
          : 'Notifications'
      }
    >
      <Bell className="w-5 h-5 md:w-6 md:h-6 text-black" />
      {unreadCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px]
            flex items-center justify-center rounded-full
            bg-red-500 text-white text-[9px] font-bold px-1 leading-none
            animate-pop-in"
          aria-hidden="true"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
