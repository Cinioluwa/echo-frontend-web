import React from "react";
import { Link } from "react-router-dom";

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
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );

    const FollowUpIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M12 3v18" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );

    const ModerationIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1L2 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-10-5z" strokeWidth="2" />
        </svg>
    );

    const AdminIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
    );

    const CollapseIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
                        <svg className="w-full h-full" viewBox="0 0 25 27" fill="none">
                            <path
                                d="M12.5 2C6.7 2 2 6.7 2 12.5s4.7 10.5 10.5 10.5 10.5-4.7 10.5-10.5S18.3 2 12.5 2zm0 19C7.8 21 4 17.2 4 12.5S7.8 4 12.5 4 21 7.8 21 12.5 17.2 21 12.5 21z"
                                fill="#212121"
                            />
                        </svg>
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
                        <svg className="w-5 h-5 text-[#926b3d] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z" />
                        </svg>
                        <span className="text-[#926b3d] font-medium text-[12px] leading-[normal]">
                            {userBadge}
                        </span>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default AdminSoundboardSidebar;
