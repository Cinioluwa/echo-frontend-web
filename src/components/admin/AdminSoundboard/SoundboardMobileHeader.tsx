import React from "react";
import { MenuIcon } from "lucide-react";
import { useAuthStore } from "../../../stores";
import NotificationBell from "../../NotificationBell";
import UserAvatar from "../../UserAvatar";

/**
 * SoundboardMobileHeader
 * Mobile-only header row for the Soundboard, matching the Figma mobile
 * Soundboard frame (node-id 5802-21851): the Nav row (5802-21854) with the
 * Echo logo on the left and the Profile block (5802-21865) on the right
 * ("Welcome back" greeting + truncated user name, right-aligned, plus the
 * user avatar). The hamburger/menu control is integrated into this same row
 * (left, ahead of the logo) instead of standing alone as a bare
 * hamburger-plus-title header.
 *
 * Notes:
 * - The notification bell reuses the existing live `NotificationBell`
 *   component (unread badge + navigation, same as the desktop NavBar) rather
 *   than a static exported icon, so it stays functional.
 * - Rendered only below the md breakpoint; desktop keeps the persistent
 *   sidebar plus the "Soundboard" page title.
 */
interface SoundboardMobileHeaderProps {
    openMenu: boolean;
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const SoundboardMobileHeader: React.FC<SoundboardMobileHeaderProps> = ({
    openMenu,
    setOpenMenu,
}) => {
    const user = useAuthStore((state) => state.user);
    const displayName = user ? `${user.firstName} ${user.lastName}` : "Guest";

    return (
        <div
            className="w-full flex md:hidden items-center justify-between gap-3"
            data-node-id="soundboard-mobile-header"
        >
            {/* Left: menu trigger + logo */}
            <div className="flex items-center gap-2 min-w-0 shrink-0">
                <button
                    type="button"
                    onClick={() => setOpenMenu(!openMenu)}
                    aria-label={openMenu ? "Close menu" : "Open menu"}
                    aria-expanded={openMenu}
                    className="p-1 -ml-1 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors shrink-0"
                >
                    <MenuIcon className="w-6 h-6" color="#F49B31" />
                </button>
                <div className="flex items-center gap-[5px] shrink-0">
                    <img
                        src="/assets/images/Echo Logo_black.svg"
                        alt="Echo logo"
                        className="brightness-0 contrast-200 h-[20px] w-[19px]"
                    />
                    <span className="font-bold text-[24px] text-black font-['Poppins',sans-serif] leading-normal">
                        Echo
                    </span>
                </div>
            </div>

            {/* Right: notification bell + greeting/name + avatar */}
            <div className="flex items-center gap-[5px] min-w-0">
                <NotificationBell />
                <div className="text-right max-w-[65px]">
                    <p className="text-[#926B3D] text-[8px] font-medium leading-normal font-['Poppins',sans-serif] whitespace-nowrap text-right">
                        Welcome back!
                    </p>
                    <p className="text-[9px] text-black font-medium leading-normal font-['Poppins',sans-serif] truncate text-right">
                        {displayName}
                    </p>
                </div>
                <UserAvatar
                    user={user}
                    size="md"
                    responsive
                    bgColor="bg-[#f49b31]"
                    className="shrink-0"
                />
            </div>
        </div>
    );
};

export default SoundboardMobileHeader;
