import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { User, LogOut, Settings, HelpCircle } from 'lucide-react';

const UserInfo = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  console.log("UserInfo render:", { user: user ? `${user.email} (${user.role})` : "null", isLoading, error });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleProfileSettings = () => {
    setIsDropdownOpen(false);
    navigate("/user/profile");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleImageLoadError = () => {
    setImageLoadError(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="inline-flex mr-2.5 ml-2.5 md:ml-[55px] items-center gap-2.5 md:mr-[35px]">
        <div className="animate-pulse flex items-center gap-2.5">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="w-[50px] h-[50px] bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Error or no user state
  if (error || !user) {
    return (
      <div className="inline-flex mr-2.5 ml-2.5 md:ml-[55px] items-center gap-2.5 md:mr-[35px]">
        <div className="text-end">
          <p className="text-[#926B3D] text-[7px] md:text-[12px]">Guest</p>
        </div>
        <span className="w-[50px] inline-flex items-center justify-center h-[50px] cursor-pointer rounded-full bg-gray-200">
          <User className="w-6 h-6 text-gray-500" />
        </span>
      </div>
    );
  }

  // Display user info
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="relative inline-flex mr-2.5 ml-2.5 md:ml-[55px] items-center gap-2.5 md:mr-[35px]" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="inline-flex items-center gap-2.5 cursor-pointer"
      >
        <div className="text-end">
          <p className="text-[#926B3D] text-[7px] md:text-[12px]">Welcome back!</p>
          <p className="text-[10px] md:text-[14px]">{fullName}</p>
        </div>

        <span className="w-[50px] inline-flex items-center justify-center h-[50px] cursor-pointer rounded-full bg-[#f49b31] hover:bg-[#f49b31]-300 transition-colors overflow-hidden">
          {user.profilePicture && !imageLoadError ? (
            <img
              src={user.profilePicture}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={handleImageLoadError}
            />
          ) : (
            <User className="w-6 h-6 text-gray-500" />
          )}
        </span>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-tl-lg rounded-tr-lg shadow-lg border border-[#CECECE] z-50 w-[274px] overflow-hidden">
          {/* User Profile Section */}
          <div className="border-b border-[#CECECE] p-4 flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#f49b31] flex items-center justify-center shrink-0 overflow-hidden">
              {user.profilePicture && !imageLoadError ? (
                <img
                  src={user.profilePicture}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={handleImageLoadError}
                />
              ) : (
                <User className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="font-medium text-[18px] text-black truncate tracking-[-0.18px]">
                {fullName}
              </p>
              <p className="font-medium text-[16px] text-[#999999] truncate tracking-[-0.16px]">
                {user.email}
              </p>
            </div>
          </div>

          {/* Profile Settings */}
          <button
            onClick={handleProfileSettings}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-[18px] text-black">Profile Settings</span>
          </button>

          {/* Help */}
          <button
            onClick={() => setIsDropdownOpen(false)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-[18px] text-black">Help</span>
          </button>

          {/* Divider */}
          <div className="border-t border-[#CECECE] mx-4"></div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left rounded-bl-lg rounded-br-lg"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-[18px] text-black">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
