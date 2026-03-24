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
                <div className="text-right block md:hidden w-[65px]">
                    <p className="text-[#926B3D] text-[8px] font-medium leading-normal font-['Poppins',sans-serif]">
                        Welcome back!
                    </p>
                    <p className="text-[9px] text-black font-medium leading-normal truncate font-['Poppins',sans-serif]">
                        {fullName}
                    </p>
                </div>

                {/* Avatar */}
                <UserAvatar
                    user={user}
                    size="md"
                    responsive
                    bgColor="bg-gray-200"
                    className="hover:bg-gray-300 transition-colors"
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-lg shadow-lg border border-[#CECECE] z-50 w-[274px] overflow-hidden">
                    {/* User Profile Section */}
                    <div className="border-b border-[#CECECE] p-4 flex items-center gap-3">
                        <UserAvatar user={user} size="md" bgColor="bg-gray-200" />
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <p className="font-medium text-[18px] text-black truncate tracking-[-0.18px]">
                                {fullName}
                            </p>
                            {user?.email && (
                                <p className="font-medium text-[16px] text-[#999999] truncate tracking-[-0.16px]">
                                    {user.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Profile Settings */}
                    <button
                        onClick={handleProfileSettings}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-[18px] text-black">
                            Profile Settings
                        </span>
                    </button>

                    {/* Help */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <HelpCircle className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-[18px] text-black">Help</span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-[#CECECE] mx-4" />

                    {/* Sign Out */}
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-[18px] text-black">
                            Sign Out
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
