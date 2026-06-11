import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores";
import { LogOut, Settings, HelpCircle } from "lucide-react";
import UserAvatar from "../UserAvatar";
import OnboardingOverlay from "../onboarding/OnboardingOverlay";

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
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const markOnboardingComplete = useAuthStore(
    (state) => state.markOnboardingComplete,
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openOnboarding, setOpenOnboarding] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const handleProfileSettings = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const displayFullName = user ? `${user.firstName} ${user.lastName}` : userName;
  const displayEmail = user?.email || "";


  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes("/admin/soundboard")) return "soundboard";
    if (path.includes("/admin/followUp") || path.includes("/admin/followup")) return "followUp";
    if (path.includes("/admin/moderation")) return "moderation";
    if (path.includes("/admin/settings")) return "settings";
    return "soundboard";
  };

  const currentPage = getCurrentPage();

  const navButtonClass = (isActive: boolean) =>
    `w-full rounded-[15px] px-5 py-3 flex items-center gap-3 transition-colors border ${isActive
      ? "bg-[#f49b31] border-[#f49b31]"
      : "bg-transparent border-[#f49b31] hover:bg-[#fef5ea]"
    }`;

  const navTextClass = (isActive: boolean) =>
    `font-semibold text-[15px] leading-[normal] whitespace-nowrap ${isActive ? "text-[#fef5ea]" : "text-[#212121]"
    }`;

  const navIconClass = (isActive: boolean) =>
    `w-5 h-5 ${isActive ? "brightness-0 invert" : "brightness-90"}`;

  const navIconWrapperClass = (isActive: boolean) =>
    `shrink-0 ${isActive ? "brightness-0 invert" : ""}`;

  // SVG Icons
  const SoundboardIcon = () => (
    <img src="/assets/icon/admin-soundboard.svg" alt="Soundboard Icon" className={navIconClass(currentPage === "soundboard")} />
  );

  const FollowUpIcon = () => (
    <img src="/assets/icon/followup.svg" alt="Follow-up Icon" className={navIconClass(currentPage === "followUp")} />
  );

  const ModerationIcon = () => (
    <img src="/assets/icon/moderation.svg" alt="Moderation Icon" className={navIconClass(currentPage === "moderation")} />
  );

  const AdminIcon = () => (
    <img src="/assets/icon/admin-settings.svg" alt="Admin Settings Icon" className={navIconClass(currentPage === "settings")} />
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
        <Link to="/admin/soundboard" onClick={onSoundboardClick}>
          <button className={navButtonClass(currentPage === "soundboard")}>
            <SoundboardIcon />
            <span className={navTextClass(currentPage === "soundboard")}>
              Soundboard
            </span>
          </button>
        </Link>

        <Link to="/admin/followUp" onClick={onFollowUpClick}>
          <button className={navButtonClass(currentPage === "followUp")}>
            <FollowUpIcon />
            <span className={navTextClass(currentPage === "followUp")}>
              Follow up
            </span>
          </button>
        </Link>

        <Link to="/admin/moderation" onClick={onModerationClick}>
          <button className={navButtonClass(currentPage === "moderation")}>
            <div className={navIconWrapperClass(currentPage === "moderation")}>
              <ModerationIcon />
            </div>
            <span className={navTextClass(currentPage === "moderation")}>
              Moderation
            </span>
          </button>
        </Link>

        <Link to="/admin/settings" onClick={onAdminSettingsClick}>
          <button className={navButtonClass(currentPage === "settings")}>
            <div className={navIconWrapperClass(currentPage === "settings")}>
              <AdminIcon />
            </div>
            <span className={navTextClass(currentPage === "settings")}>
              Admin Settings
            </span>
          </button>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-transparent border border-[#f49b31] rounded-[15px] p-2.5 flex items-start gap-2.5 hover:bg-[#fef5ea] transition-colors"
        >
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

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute -bottom-[200px] left-[calc(100%+8px)] bg-white rounded-lg shadow-lg border border-[#CECECE] z-50 w-[220px] md:w-[204px] overflow-hidden">
            {/* User Profile Section */}
            <div className="border-b border-[#CECECE] p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
              <UserAvatar user={user} size="md" bgColor="bg-[#f49b31]" pictureUrl={userAvatar || undefined} />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="font-medium text-[14px] md:text-[16px] text-black truncate tracking-[-0.14px] md:tracking-[-0.16px] text-left">
                  {displayFullName}
                </p>
                {displayEmail && (
                  <p className="font-medium text-[12px] md:text-[14px] text-[#999999] truncate tracking-[-0.12px] md:tracking-[-0.14px] text-left">
                    {displayEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Settings */}
            <button
              onClick={handleProfileSettings}
              className="w-full px-3.5 md:px-4 py-2.5 md:py-3 flex items-center gap-2.5 md:gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Settings className="w-[18px] h-[18px] md:w-5 md:h-5 text-gray-600" />
              <span className="font-medium text-[13px] md:text-[15px] text-black">
                Profile Settings
              </span>
            </button>

            {/* Help */}
            <button
              onClick={() => {
                setIsOpen(false);
                setOpenOnboarding(true);
              }}
              className="w-full px-3.5 md:px-4 py-2.5 md:py-3 flex items-center gap-2.5 md:gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <HelpCircle className="w-[18px] h-[18px] md:w-5 md:h-5 text-gray-600" />
              <span className="font-medium text-[13px] md:text-[15px] text-black">Help</span>
            </button>

            {/* Divider */}
            <div className="border-t border-[#CECECE] mx-4" />

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="w-full px-3.5 md:px-4 py-2.5 md:py-3 flex items-center gap-2.5 md:gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <LogOut className="w-[18px] h-[18px] md:w-5 md:h-5 text-gray-600" />
              <span className="font-medium text-[13px] md:text-[15px] text-black">Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {openOnboarding && (
        <OnboardingOverlay
          onFinish={() => {
            void markOnboardingComplete();
            setOpenOnboarding(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminSideBar;
