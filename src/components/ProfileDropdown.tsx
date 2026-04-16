/**
 * ProfileDropdown
 * Figma ref: Profile dropdown in S2 (4167:11817) and S4 (4175:12496)
 * Phase: 1
 */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { LogOut, Settings, HelpCircle } from "lucide-react";
import UserAvatar from "./UserAvatar";
import OnboardingOverlay from "./onboarding/OnboardingOverlay";

const ProfileDropdown = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Open Onboarding tutorial through the help button
  const [openOnboarding, setOpenOnboarding] = useState(false);

  
  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2.5">
        <div className="animate-pulse flex items-center gap-2.5">
          <div className="h-4 w-24 bg-gray-300 rounded hidden md:block" />
          <div className="w-[25px] h-[25px] md:w-[50px] md:h-[50px] bg-gray-300 rounded-full" />
        </div>
      </div>
    );
  }

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest";

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-[5px] cursor-pointer"
      >
        {/* Desktop: full user info */}
        <div className="text-right hidden md:block">
          <p className="text-[#926B3D] text-[12px] font-medium leading-normal font-['Poppins',sans-serif]">
            Welcome back!
          </p>
          <p className="text-[14px] text-black font-medium leading-normal font-['Poppins',sans-serif]">
            {fullName}
          </p>
        </div>

        {/* Mobile: truncated user info */}
        <div className="text-right block md:hidden max-w-[100px]">
          <p className="text-[#926B3D] text-[10px] font-medium leading-normal font-['Poppins',sans-serif] whitespace-nowrap truncate">
            Welcome back!
          </p>
          <p className="text-[11px] text-black font-medium leading-normal truncate font-['Poppins',sans-serif]">
            {fullName}
          </p>
        </div>

        {/* Avatar */}
        <UserAvatar
          user={user}
          size="md"
          responsive
          bgColor="bg-[#f49b31]"
          className="hover:bg-[#f49b31]-300 transition-colors"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-lg shadow-lg border border-[#CECECE] z-50 w-[220px] md:w-[274px] overflow-hidden">
          {/* User Profile Section */}
          <div className="border-b border-[#CECECE] p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
            <UserAvatar user={user} size="md" bgColor="bg-[#f49b31]" />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="font-medium text-[14px] md:text-[16px] text-black truncate tracking-[-0.14px] md:tracking-[-0.16px]">
                {fullName}
              </p>
              {user?.email && (
                <p className="font-medium text-[12px] md:text-[14px] text-[#999999] truncate tracking-[-0.12px] md:tracking-[-0.14px]">
                  {user.email}
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

      {openOnboarding && <OnboardingOverlay onFinish={() => setOpenOnboarding(false)}/>}
    </div>
  );
};

export default ProfileDropdown;
