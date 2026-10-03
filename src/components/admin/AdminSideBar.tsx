import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore, useUIStore } from "../../stores";
import { Building2, LogOut, Settings, HelpCircle } from "lucide-react";
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
  userName,
  userBadge,
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
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

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

  const getBadgeFromOrg = () => {
    if (!user?.organization?.name) return "ADMIN";
    const words = user.organization.name.split(" ");
    if (words.length > 1) {
      return `ADMIN.${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return `ADMIN.${user.organization.name.substring(0, 2)}`.toUpperCase();
  };

  const displayFullName = user ? `${user.firstName} ${user.lastName}` : (userName || "Admin");
  const displayEmail = user?.email || "";
  const displayBadge = userBadge || (user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : getBadgeFromOrg());
  const isRepresentative = user?.role === "REPRESENTATIVE" && user.representativeProfile?.isActive === true;
  const isRepresentativeManager =
    isRepresentative &&
    user?.representativeProfile?.canManageReps === true;


  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes("/admin/soundboard")) return "soundboard";
    if (path.includes("/admin/followUp") || path.includes("/admin/followup")) return "followUp";
    if (path.includes("/admin/moderation")) return "moderation";
    if (path.includes("/admin/settings")) return "settings";
    if (path.includes("/admin/institution")) return "institution";
    return "soundboard";
  };

  const currentPage = getCurrentPage();

  const navButtonClass = (isActive: boolean) =>
    `w-full overflow-hidden rounded-[15px] px-5 py-3 justify-start flex items-center gap-3 transition-colors duration-300 ease-in-out border ${isActive
      ? "bg-[#f49b31] border-[#f49b31]"
      : "bg-transparent border-[#f49b31] hover:bg-[#fef5ea]"
    }`;

  const navTextClass = (isActive: boolean) =>
    `min-w-0 flex-1 overflow-hidden whitespace-nowrap text-left font-semibold text-[15px] leading-[normal] transition-opacity duration-300 ease-in-out ${isSidebarCollapsed ? "opacity-0" : "opacity-100"} ${isActive ? "text-[#fef5ea]" : "text-[#212121]"}`;

  const navIconClass = (isActive: boolean) =>
    `w-5 h-5 ${isActive ? "brightness-0 invert" : "brightness-90"}`;

  const navIconWrapperClass = (isActive: boolean) =>
    `shrink-0 ${isActive ? "brightness-0 invert" : ""}`;

  // SVG Icons
  const SoundboardIcon = () => (
    <img src="/assets/icon/admin-soundboard.svg" alt="Soundboard Icon" className={`${navIconClass(currentPage === "soundboard")} shrink-0`} />
  );

  const FollowUpIcon = () => (
    <img src="/assets/icon/followup.svg" alt="Follow-up Icon" className={`${navIconClass(currentPage === "followUp")} shrink-0`} />
  );

  const ModerationIcon = () => (
    <img src="/assets/icon/moderation.svg" alt="Moderation Icon" className={`${navIconClass(currentPage === "moderation")} shrink-0`} />
  );

  const AdminIcon = () => (
    <img src="/assets/icon/admin-settings.svg" alt="Admin Settings Icon" className={`${navIconClass(currentPage === "settings")} shrink-0`} />
  );

  const CollapseIcon = () => (
    <img src="/assets/icon/expand.svg" alt="Collapse Icon" className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isSidebarCollapsed ? "rotate-180" : ""}`} />
  );

  return (
    <div
      className={`hidden h-screen shrink-0 md:flex bg-[#fef5ea] border-r border-b border-[#f49b31] rounded-br-[20px] px-5 ${isSidebarCollapsed ? "w-[102px]" : "w-[230px]"} flex-col gap-5 overflow-visible pt-5 pb-[30px] transition-[width,padding] duration-300 ease-in-out will-change-[width]`}
      data-node-id="admin-soundboard-sidebar"
    >
      {/* Logo Section */}
      <div className="relative flex w-full items-center justify-between">
        <div className={`flex min-w-0 items-center gap-2 `}>
          <img src="/assets/images/Echo Logo_black.svg" alt="Echo Logo" className="h-[27px] w-[25px] shrink-0" />
          <h1 className={`text-[#212121] font-bold text-[20px] leading-[normal] whitespace-nowrap transition-opacity duration-300 ease-in-out ${isSidebarCollapsed ? "pointer-events-none absolute left-[33px] opacity-0" : "opacity-100"}`}>
            Echo
          </h1>
        </div>
        <button
          onClick={() => {
            onToggleSidebar?.();
            toggleSidebar();
          }}
          className="absolute right-0 flex h-5 w-5 shrink-0 items-center justify-center hover:opacity-70 transition-opacity duration-300"
          aria-label="Toggle sidebar"
        >
          <CollapseIcon />
        </button>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-col gap-3.5">
        {!isRepresentative && (
          <>
            <Link to="/admin/soundboard" onClick={onSoundboardClick}>
              <button className={navButtonClass(currentPage === "soundboard")}>
                <SoundboardIcon />
                <span className={navTextClass(currentPage === "soundboard")}>Soundboard</span>
              </button>
            </Link>

            <Link to="/admin/followUp" onClick={onFollowUpClick}>
              <button className={navButtonClass(currentPage === "followUp")}>
                <FollowUpIcon />
                <span className={navTextClass(currentPage === "followUp")}>Follow up</span>
              </button>
            </Link>

            <Link to="/admin/moderation" onClick={onModerationClick}>
              <button className={navButtonClass(currentPage === "moderation")}>
                <div className={navIconWrapperClass(currentPage === "moderation")}>
                  <ModerationIcon />
                </div>
                <span className={navTextClass(currentPage === "moderation")}>Moderation</span>
              </button>
            </Link>

            <Link to="/admin/settings" onClick={onAdminSettingsClick}>
              <button className={navButtonClass(currentPage === "settings")}>
                <div className={navIconWrapperClass(currentPage === "settings")}>
                  <AdminIcon />
                </div>
                <span className={navTextClass(currentPage === "settings")}>Admin Settings</span>
              </button>
            </Link>
          </>
        )}

        {isRepresentative && (
          <Link to="/admin/soundboard">
            <button className={navButtonClass(currentPage === "soundboard")}>
              <SoundboardIcon />
              <span className={navTextClass(currentPage === "soundboard")}>Representative inbox</span>
            </button>
          </Link>
        )}

        {(!isRepresentative || isRepresentativeManager) && (
          <Link to="/admin/institution">
            <button className={navButtonClass(currentPage === "institution")}>
              <Building2 className={`h-5 w-5 shrink-0 ${currentPage === "institution" ? "text-white" : "text-[#F49B31]"}`} aria-hidden="true" />
              <span className={navTextClass(currentPage === "institution")}>Institution</span>
            </button>
          </Link>
        )}
      </div>

      {/* User Profile Section */}
      <div className="relative mt-auto mb-2 w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-transparent border border-[#f49b31] rounded-[15px] flex items-center hover:bg-[#fef5ea] transition-colors duration-300 ease-in-out w-full justify-start px-[7px] py-2 ${isSidebarCollapsed ? "gap-0" : "gap-2.5"}`}
        >
          {/* Avatar */}
          {userAvatar || user?.profilePicture ? (
            <img
              src={userAvatar || user?.profilePicture}
              alt={displayFullName}
              className="w-[45px] h-[45px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-[45px] h-[45px] rounded-full bg-[#f49b31] flex items-center justify-center shrink-0 text-[#fef5ea] font-bold text-[18px]">
              {displayFullName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* User Info */}
          <div className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap text-left transition-opacity duration-300 ease-in-out ${isSidebarCollapsed ? "opacity-0" : "opacity-100"}`}>
              <p className="text-[#212121] font-medium text-[14px] leading-[normal] text-left truncate">
                {displayFullName}
              </p>
              <div className="flex items-center gap-[5px] mt-[5px]">
                <img src="/assets/icon/badge-check.svg" alt="Echo Badge" className="w-[15px] h-[15px]" />
                <span className="text-[#926b3d] font-medium text-[12px] leading-[normal]">
                  {displayBadge}
                </span>
              </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute bottom-0 left-[calc(100%+8px)] max-h-[calc(100vh-16px)] overflow-y-auto bg-white rounded-lg shadow-lg border border-[#CECECE] z-50 w-[220px] md:w-[204px] overflow-hidden">
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
