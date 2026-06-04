import React from "react";
import { Link } from "react-router-dom";
interface AdminSidebarProps {
  userAvatar?: string;
  userName?: string;
  userBadge?: string;
  onToggleSidebar?: () => void;
  onSoundboardClick?: () => void;
  onFollowUpClick?: () => void;
  onModerationClick?: () => void;
  onAdminSettingsClick?: () => void;
}

const AdminSideBar: React.FC<AdminSidebarProps> = ({
  userAvatar = "",
  userName = "Osagumwenro Ugbo",
  userBadge = "ADMIN.CU",
  onToggleSidebar,
  onSoundboardClick,
  onFollowUpClick,
  onModerationClick,
  onAdminSettingsClick,
}) => {
  // SVG Icons
  const SoundboardIcon = () => (
    <img src="/assets/icon/admin-soundboard.svg" alt="Soundboard Icon" className="w-5 h-5" />
  );

  const FollowUpIcon = () => (
    <img src="/assets/icon/followup.svg" alt="Follow-up Icon" className="w-5 h-5" />
  );

  const ModerationIcon = () => (
    <img src="/assets/icon/moderation.svg" alt="Moderation Icon" className="w-5 h-5" />
  );

  const AdminIcon = () => (
    <img src="/assets/icon/admin-settings.svg" alt="Admin Settings Icon" className="w-5 h-5" />
  );

  const CollapseIcon = () => (
    <img src="/assets/icon/expand.svg" alt="Collapse Icon" className="w-4 h-4" />
  );

  return (
    <div
      className="hidden md:flex bg-[#fef5ea] border-r border-b border-[#f49b31] rounded-br-[20px] w-[230px] flex-col gap-5 pt-5 pb-[30px] px-5"
      data-node-id="admin-soundboard-sidebar"
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[25px] h-[27px] flex items-center justify-center">
            <img src="/assets/images/Echo Logo_black.svg" alt="Echo Logo" className="w-full h-full" />
          </div>
          <h1 className="text-[#212121] font-bold text-[20px] leading-[normal] whitespace-nowrap">
            Echo
          </h1>
        </div>
        <button
          onClick={onToggleSidebar}
          className="hover:opacity-70 transition-opacity"
          aria-label="Toggle sidebar"
        >
          <CollapseIcon />
        </button>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-col gap-3.5">
        {/* Soundboard Button - Active */}
        <Link to="/admin/soundboard" onClick={onSoundboardClick}>
          <button className="w-full bg-[#f49b31] hover:bg-[#e88a20] border border-[#f49b31] rounded-[15px] px-5 py-3 flex items-center gap-3 transition-colors">
            <SoundboardIcon />
            <span className="text-[#fef5ea] font-semibold text-[15px] leading-[normal] whitespace-nowrap">
              Soundboard
            </span>
          </button>
        </Link>

        {/* Follow up Button */}
        <Link to="/admin/followUp" onClick={onFollowUpClick}>
          <button className="w-full bg-transparent border border-[#f49b31] rounded-[15px] px-6 py-3 h-12 flex items-center gap-3 hover:bg-[#fef5ea] transition-colors">
            <FollowUpIcon />
            <span className="text-[#212121] font-semibold text-[15px] leading-[normal] whitespace-nowrap">
              Follow up
            </span>
          </button>
        </Link>

        {/* Moderation Button */}
        <Link to="/admin/moderation" onClick={onModerationClick}>
          <button className="w-full bg-transparent border border-[#f49b31] rounded-[15px] pl-5 pr-6 py-3 flex items-center gap-3 hover:bg-[#fef5ea] transition-colors">
            <div className="shrink-0">
              <ModerationIcon />
            </div>
            <span className="text-[#212121] font-semibold text-[15px] leading-[normal] whitespace-nowrap">
              Moderation
            </span>
          </button>
        </Link>

        {/* Admin Settings Button */}
        <Link to="/admin/settings" onClick={onAdminSettingsClick}>
          <button className="w-full bg-transparent border border-[#f49b31] rounded-[15px] pl-[22px] pr-5 py-[13px] flex items-center gap-3 hover:bg-[#fef5ea] transition-colors">
            <div className="shrink-0">
              <AdminIcon />
            </div>
            <span className="text-[#212121] font-semibold text-[15px] leading-[normal] whitespace-nowrap">
              Admin Settings
            </span>
          </button>
        </Link>
      </div>

      {/* User Profile Section */}
      <button className="w-full bg-transparent border border-[#f49b31] rounded-[15px] p-2.5 flex items-start gap-2.5 hover:bg-[#fef5ea] transition-colors">
        {/* Avatar */}
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-[45px] h-[45px] rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-[45px] h-[45px] rounded-full bg-[#f49b31] flex items-center justify-center shrink-0 text-[#fef5ea] font-bold text-[18px]">
            {userName?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[#212121] font-medium text-[14px] leading-[normal] text-left truncate">
            {userName}
          </p>
          <div className="flex items-center gap-[5px] mt-[5px]">
            <img src="/assets/icon/badge-check.svg" alt="Echo Badge" className="w-[15px] h-[15px]" />
            <span className="text-[#926b3d] font-medium text-[12px] leading-[normal]">
              {userBadge}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default AdminSideBar;
