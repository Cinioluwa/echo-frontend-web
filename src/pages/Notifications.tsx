/**
 * Notifications
 * Full-page notification feed — lists all past notifications,
 * marks items as read on click, and navigates to the relevant deep-link.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';
import { useNotificationStore } from '../stores/ui/useNotificationStore';
import type { NotificationType } from '../api/types';

// ── Icon / label map for each notification type ────────────────────────────
const TYPE_META: Record<NotificationType, { emoji: string; label: string }> = {
  NEW_WAVE_ON_PING:        { emoji: '🌊', label: 'New wave on your ping' },
  NEW_COMMENT_ON_POST:     { emoji: '💬', label: 'New comment on your post' },
  PING_SURGED_MILESTONE:   { emoji: '🚀', label: 'Surge milestone reached' },
  COMMENT_REPLY:           { emoji: '↩️', label: 'Reply to your comment' },
  WAVE_STATUS_UPDATED:     { emoji: '📋', label: 'Wave status updated' },
  OFFICIAL_RESPONSE:       { emoji: '📣', label: 'Official response' },
  ANNOUNCEMENT:            { emoji: '📢', label: 'Announcement' },
};

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, isLoadingFeed, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleItemClick = async (id: number | string, url?: string) => {
    await markAsRead(id);
    if (url) navigate(url);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#FFFBF6]">

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Page header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[#4A3728]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#4A3728] font-['Poppins',sans-serif]">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-xs text-[#7D7D7D]">{unreadCount} unread</p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => void markAllAsRead()}
              className="flex items-center gap-1.5 text-sm text-[#F49B31] hover:text-[#d88429] font-medium transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* ── Content ─────────────────────────────────────────── */}
        {isLoadingFeed ? (
          /* Skeleton loader */
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-orange-100 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-orange-100 rounded w-2/3" />
                  <div className="h-3 bg-orange-100 rounded w-full" />
                  <div className="h-2 bg-orange-50 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <Bell className="w-8 h-8 text-[#F49B31]" />
            </div>
            <p className="text-[#4A3728] font-semibold text-lg">All caught up!</p>
            <p className="text-[#7D7D7D] text-sm max-w-xs">
              When someone interacts with your pings or comments you'll see it here.
            </p>
          </div>
        ) : (
          /* Notification list */
          <div className="space-y-2">
            {notifications.map((n) => {
              const meta = TYPE_META[n.type] ?? { emoji: '🔔', label: n.type };
              return (
                <button
                  key={n.id}
                  onClick={() => void handleItemClick(n.id, n.url)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer
                    ${n.isRead
                      ? 'bg-white border-orange-100 hover:bg-orange-50'
                      : 'bg-[#FFF5E9] border-[#F49B31]/40 hover:bg-orange-100'
                    }`}
                >
                  {/* Emoji avatar */}
                  <span className="text-2xl leading-none mt-0.5 shrink-0">{meta.emoji}</span>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold text-[#4A3728] ${!n.isRead ? 'font-bold' : ''}`}>
                      {n.title}
                    </p>
                    <p className="text-sm text-[#7D7D7D] mt-0.5 leading-snug line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-[11px] text-[#ADADAD] mt-1.5">{formatTime(n.createdAt)}</p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#F49B31] mt-1.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
