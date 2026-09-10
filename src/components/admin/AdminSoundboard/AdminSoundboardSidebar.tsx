import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores";
interface AdminSoundboardSidebarProps {
    userAvatar?: string;
    userName?: string;
    userBadge?: string;
    onToggleSidebar?: () => void;
    onSoundboardClick?: () => void;
    onFollowUpClick?: () => void;
    onModerationClick?: () => void;
    onAdminSettingsClick?: () => void;
}

const AdminSoundboardSidebar: React.FC<AdminSoundboardSidebarProps> = ({
    userAvatar = "",
    userName,
    userBadge,
    onToggleSidebar,
    onSoundboardClick,
    onFollowUpClick,
    onModerationClick,
    onAdminSettingsClick,
}) => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [isOpen, setIsOpen] = useState(false);

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

    const displayFullName = user ? `${user.firstName} ${user.lastName}` : (userName || "Admin User");
    const displayEmail = user?.email || "";
    const displayBadge = userBadge || (user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : getBadgeFromOrg());

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
            className="bg-[#fef5ea] border-r border-b border-[#f49b31] rounded-br-[20px] w-[230px] flex flex-col gap-5 pt-5 pb-[30px] px-5"
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
                <div className="flex-1 min-w-0">
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
        </div>
    );
};

export default AdminSoundboardSidebar;
