/**
 * Notifications
 * Full-page notification feed — lists all past notifications,
 * marks items as read on click, and navigates to the relevant deep-link.
 * Adheres to Echo Design Philosophy & Brand System (DESIGN-GUIDE.md).
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ArrowLeft,
  Waves,
  MessageSquare,
  TrendingUp,
  CornerDownRight,
  ClipboardCheck,
  Megaphone,
  AlertTriangle,
  CheckCircle2,
  Building2,
  FileSignature,
} from 'lucide-react';
import { useNotificationStore } from '../stores/ui/useNotificationStore';
import type { NotificationType } from '../api/types';

// ── Icon / label map for each notification type ────────────────────────────
const TYPE_META: Partial<
  Record<
    NotificationType,
    { icon: React.ComponentType<{ className?: string }>; label: string }
  >
> = {
  // Waves & Pings
  NEW_WAVE_ON_PING: { icon: Waves, label: 'New wave on your ping' },
  WAVE_APPROVED: { icon: CheckCircle2, label: 'Wave approved' },
  WAVE_STATUS_UPDATED: { icon: ClipboardCheck, label: 'Wave status updated' },
  PING_SURGED_MILESTONE: { icon: TrendingUp, label: 'Surge milestone reached' },

  // Comments
  NEW_COMMENT_ON_POST: { icon: MessageSquare, label: 'New comment on your post' },
  COMMENT_REPLY: { icon: CornerDownRight, label: 'Reply to your comment' },
  COMMENT_SURGE: { icon: TrendingUp, label: 'Comment surged' },

  // Official / Announcements
  OFFICIAL_RESPONSE_POSTED: { icon: Megaphone, label: 'Official response' },
  OFFICIAL_RESPONSE: { icon: Megaphone, label: 'Official response' },
  ANNOUNCEMENT_POSTED: { icon: Bell, label: 'Announcement' },
  ANNOUNCEMENT: { icon: Bell, label: 'Announcement' },

  // Reports & Moderation
  POST_REPORTED: { icon: AlertTriangle, label: 'Post reported' },
  MODERATION_WARNING: { icon: AlertTriangle, label: 'Moderation warning' },
  MODERATION_SUSPENSION: { icon: AlertTriangle, label: 'Account suspended' },
  MODERATION_BAN: { icon: AlertTriangle, label: 'Account banned' },
  MODERATION_IDENTITY_DISCLOSURE_REQUESTED: { icon: AlertTriangle, label: 'Identity disclosure requested' },
  INSTITUTION_LEADER_RECOMMENDED: { icon: Building2, label: 'Institution leader recommendation' },
  FOUNDING_AGREEMENT_READY: { icon: FileSignature, label: 'Founding agreement ready' },
  INSTITUTION_CLAIMED: { icon: Building2, label: 'Institution claimed' },
};

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    isLoadingFeed,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

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
    <div className="min-h-screen bg-white rounded-[20px] border border-black/15 pb-12">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Page header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-[#060B13] shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#060B13] font-['Poppins',sans-serif] tracking-tight whitespace-nowrap shrink-0">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="shrink-0 bg-[#FFC37B]/40 text-[#E8911A] text-xs font-semibold px-2.5 py-0.5 rounded-full font-['Inter',sans-serif] whitespace-nowrap">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => void markAllAsRead()}
              className="self-end sm:self-auto shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F49B31] border border-[#F49B31] hover:bg-[#F49B31] hover:text-white rounded-full px-3.5 py-1.5 transition-all cursor-pointer font-['Inter',sans-serif] whitespace-nowrap"
            >
              <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                  className="flex items-start gap-3.5 p-4 bg-[#FBFBFA] rounded-[20px] border border-black/5 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAEEDA] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-[#FAEEDA] rounded w-2/3" />
                    <div className="h-3 bg-[#FAEEDA]/70 rounded w-full" />
                    <div className="h-2.5 bg-[#FAEEDA]/50 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-[#FDFDFD] rounded-[16px] border border-dashed border-black/10 text-center">
              <div className="w-14 h-14 rounded-full bg-[#FAE9D4] text-[#F49B31] flex items-center justify-center mb-4">
                <Bell className="w-7 h-7" />
              </div>
              <p className="text-[#060B13] font-bold text-lg font-['Poppins',sans-serif]">
                All caught up!
              </p>
              <p className="text-[#737373] text-sm max-w-sm mt-1 font-['Inter',sans-serif] leading-relaxed">
                When someone interacts with your pings, waves, or comments, you'll see it here.
              </p>
            </div>
          ) : (
            /* Notification list */
            <div className="space-y-3">
              {notifications.map((n) => {
                const meta = TYPE_META[n.type];
                const IconComponent = meta?.icon ?? Bell;
                const formattedType = n.type ? n.type.replace(/_/g, ' ') : 'Notification';
                const fallbackLabel = meta?.label ?? (formattedType.charAt(0).toUpperCase() + formattedType.slice(1).toLowerCase());
                const displayTitle = n.title || fallbackLabel;

                return (
                  <button
                    key={n.id}
                    onClick={() => void handleItemClick(n.id, n.url)}
                    className={`w-full text-left flex items-start gap-3.5 p-4 rounded-[20px] border transition-all cursor-pointer shadow-xs ${
                      n.isRead
                        ? 'bg-[#FBFBFA] border-black/5 hover:border-black/15 hover:shadow-xs'
                        : 'bg-[#FFF9F2] border-[#F49B31]/30 hover:border-[#F49B31]/60 hover:shadow-xs'
                    }`}
                  >
                    {/* Icon avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        n.isRead
                          ? 'bg-[#F0EEEB] text-[#737373]'
                          : 'bg-[#FAE9D4] text-[#F49B31]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0 font-['Inter',sans-serif]">
                      <p
                        className={`text-[14px] leading-snug font-['Poppins',sans-serif] ${
                          n.isRead ? 'font-normal text-[#555555]' : 'font-bold text-[#060B13]'
                        }`}
                      >
                        {displayTitle}
                      </p>
                      <p className={`text-[13px] mt-1 leading-relaxed line-clamp-2 ${
                        n.isRead ? 'text-[#777777]' : 'text-[#444444]'
                      }`}>
                        {n.body}
                      </p>
                      <p className="text-[11px] text-[#999999] mt-1.5 font-medium">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!n.isRead && (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-[#F49B31] mt-2 shrink-0 animate-pulse"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};

export default Notifications;
