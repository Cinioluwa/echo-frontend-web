import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Waves } from "lucide-react";
import { categoryImages } from "../CategoryImages";
import type { AdminPing } from "../../api/types/admin.types";
import { adminService } from "../../api";
import PostActionMenu from "./PostActionMenu";
import PostEngagementMenu from "./PostEngagementMenu";
import { ToastContainer } from "../shared/Toast";
import type { ToastItem } from "../shared/Toast";

const surge = "/assets/images/surge.svg";
const waveMenu = "/assets/images/waveMenu.svg";
const dropdown = "/assets/images/customDropdown.svg";
const dropdown_menu = "/assets/images/dropdown_menu.svg";

interface AdminPingCardProps {
  pings: AdminPing;
  onUpdate?: () => void;
}

// Progress status badge — shown on the card so admins can scan status at a glance
const getProgressBadge = (ping: AdminPing) => {
  const status = ping.progressStatus || "NONE";
  const map: Record<string, { label: string; bg: string; text: string }> = {
    NONE: { label: "Open", bg: "#F3F4F6", text: "#374151" },
    ACKNOWLEDGED: { label: "Acknowledged", bg: "#1F2937", text: "#FFFFFF" },
    IN_PROGRESS: { label: "In Progress", bg: "#DBEAFE", text: "#1E40AF" },
    RESOLVED: { label: "Resolved", bg: "#FEF5EA", text: "#F49B31" },
  };
  const cfg = map[status] || map.NONE;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-poppins font-semibold text-[10px]"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: cfg.text === "#FFFFFF" ? "#FFFFFF" : cfg.text }}
      />
      {cfg.label}
    </span>
  );
};

const AdminPingCard = ({ pings, onUpdate }: AdminPingCardProps) => {
  const navigate = useNavigate();
  const [acknowledged, setAcknowledged] = useState(!!pings.acknowledgedAt);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEngagementMenu, setOpenEngagementMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (variant: ToastItem["variant"]) => {
    const id = `${Date.now()}`;
    setToasts((prev) => [...prev, { id, variant }]);
  };

  const handleAcknowledge = async (e: React.MouseEvent) => {
    e.stopPropagation(); // don't navigate when clicking acknowledge
    if (loading || acknowledged) return;
    try {
      setLoading(true);
      await adminService.acknowledgePing(pings.id);
      setAcknowledged(true);
      pushToast("ping");
      if (onUpdate) onUpdate();
    } catch {
      pushToast("deleted"); // reuse "deleted" variant as error indicator
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/admin/soundboard/${pings.id}`);
  };

  const authorName = pings.isAnonymous
    ? "Anonymous"
    : pings.author
    ? `${pings.author.firstName} ${pings.author.lastName}`
    : "Anonymous";

  const avatarUrl =
    !pings.isAnonymous && pings.author
      ? (pings.author as any).profilePicture ||
        `https://ui-avatars.com/api/?name=${pings.author.firstName}+${pings.author.lastName}&background=f49b31&color=fff&size=80`
      : `https://ui-avatars.com/api/?name=A&background=cacaca&color=fff&size=80`;

  const categoryIcon = pings.category?.name
    ? (categoryImages as Record<string, string>)[pings.category.name] ||
      (categoryImages as Record<string, string>).General
    : null;

  const waveCount = pings._count?.waves ?? 0;
  const commentCount = pings._count?.comments ?? 0;
  const surgeCount = pings.surgeCount || pings._count?.surges || 0;

  const postedDaysAgo = Math.floor(
    (Date.now() - new Date(pings.createdAt).getTime()) / 86400000
  );
  const postedLabel =
    postedDaysAgo === 0
      ? "Today"
      : postedDaysAgo === 1
      ? "Yesterday"
      : `${postedDaysAgo}d ago`;

  return (
    <div className="relative">
      {/* Toast feedback */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <div
        onClick={handleCardClick}
        className="m-[15px] md:m-0 bg-white rounded-[10px] border border-[#F0EDE8] hover:border-[#F49B31]/30 hover:shadow-md transition-all duration-150 cursor-pointer overflow-hidden"
      >
        {/* Card header: title + menu */}
        <div className="flex justify-between items-start gap-3 px-5 pt-4 pb-2">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <span className="cursor-pointer mt-0.5 flex-shrink-0">
              <img src={dropdown} alt="" />
            </span>
            <p className="text-[13px] md:text-[14px] font-semibold text-[#1a1a1a] leading-snug line-clamp-2">
              {pings.title}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {getProgressBadge(pings)}
            <span
              onClick={(e) => { e.stopPropagation(); setOpenMenu(true); }}
              className="cursor-pointer p-1 rounded hover:bg-[#FEF5EA] transition-colors"
            >
              <img src={waveMenu} alt="options" />
            </span>
          </div>

          {openMenu && (
            <PostActionMenu
              setOpenMenu={setOpenMenu}
              entityType="ping"
              entityId={pings.id}
              onUpdate={onUpdate}
            />
          )}
        </div>

        {/* Author row + category */}
        <div className="flex justify-between items-center px-5 py-2">
          <div className="flex items-center gap-2.5">
            <img
              src={avatarUrl}
              alt={authorName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-[12px] md:text-[13px] font-semibold text-[#1a1a1a] truncate max-w-[150px]">
                {authorName}
              </span>
              <span className="text-[#8B8E8D] text-[11px]">{postedLabel}</span>
            </div>
          </div>

          {pings.category && (
            <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] text-[#626665]">
              {categoryIcon && (
                <img src={categoryIcon} alt={pings.category.name} className="w-4 h-4" />
              )}
              <span>{pings.category.name}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-3">
          <p className="text-[#626665] text-[13px] line-clamp-3 border-b border-[#F0EDE8] pb-3">
            {pings.content}
          </p>
        </div>

        {/* Footer: stats + actions */}
        <div className="flex justify-between items-center px-5 py-2.5">
          {/* Left: comment + wave counts */}
          <div className="flex items-center gap-3 text-[#8B8E8D] text-[12px]">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </div>
            {waveCount > 0 && (
              <div className="flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" />
                <span>{waveCount}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <img src={surge} alt="surges" className="w-3.5 h-3.5" />
              <span>{surgeCount} surges</span>
            </div>
          </div>

          {/* Right: acknowledge + engagement dropdown */}
          <div
            className="flex bg-[#EF6E0B] rounded-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleAcknowledge}
              disabled={loading || acknowledged}
              className={`transition-colors duration-150 cursor-pointer ${
                acknowledged
                  ? "bg-[#F49B31] text-white font-bold"
                  : "bg-[#FEF5EA] hover:bg-[#f2e8d9]"
              } ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } py-1.5 lg:py-2 lg:px-4 flex text-[11px] font-bold items-center gap-2 border rounded-[20px] px-4`}
            >
              <img
                src={surge}
                alt=""
                className={`${acknowledged ? "brightness-0 invert" : ""} w-4 h-4 contrast-200`}
              />
              {acknowledged ? "ACKNOWLEDGED" : loading ? "..." : "ACKNOWLEDGE"}
            </button>

            <button
              className="bg-[#EF6E0B] rounded-[20px] py-1.5 lg:py-2 pl-2 pr-3"
              onClick={() => setOpenEngagementMenu(true)}
            >
              <img src={dropdown_menu} alt="more" />
            </button>

            {openEngagementMenu && (
              <PostEngagementMenu
                setEngagementMenu={setOpenEngagementMenu}
                pingId={String(pings.id)}
                onSurge={onUpdate}
                onWaveCreated={onUpdate}
                onCommentCreated={onUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPingCard;
