/**
 * MobileOptionsDropdown
 * Figma ref: 3901:9162 (Option — Unified Feed), 4187:18305 sub-frame
 * Phase: 1
 *
 * Replaces the slide-in MobileMenu. Compact floating dropdown with:
 * - "Feed" option (icon + label)
 * - "History" option (icon + label)
 * Triggered by hamburger icon in MobileHeader.
 */
import { Link, useLocation } from "react-router-dom";

const rssIcon = "/assets/images/stream.svg";
const historyIcon = "/assets/images/History Logo.svg";

interface MobileOptionsDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileOptionsDropdown = ({
    isOpen,
    onClose,
}: MobileOptionsDropdownProps) => {
    const location = useLocation();
    const isFeedActive =
        location.pathname === "/feed" || location.pathname.startsWith("/feed/");
    const isHistoryActive =
        location.pathname === "/history" ||
        location.pathname.startsWith("/history/");

    return (
        <div
            onClick={onClose}
            className={`${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                } fixed transition-opacity duration-300 z-20 ease-in inset-0 bg-black/40 md:hidden`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform transform duration-300 ease-in-out absolute left-0 top-[100px]`}
            >
                <div className="bg-[#FEF5EA] flex flex-col items-start p-2.5 rounded-tr-[10px] rounded-br-[10px]">
                    <div className="flex flex-col gap-[13px] items-start w-[122px]">
                        {/* Feed Option */}
                        <Link
                            to="/feed"
                            onClick={onClose}
                            className={`${isFeedActive
                                ? "bg-[#FFC37B] border-[#F49B31]"
                                : "bg-transparent border-[#F49B31]"
                                } border border-solid flex gap-2.5 items-center px-[15px] py-[7px] rounded-[15px] w-full`}
                        >
                            <img
                                src={rssIcon}
                                alt="Feed"
                                className="w-[15px] h-[15px]"
                            />
                            <span className="font-semibold text-[11px] text-black font-['Poppins',sans-serif] leading-normal whitespace-nowrap">
                                Feed
                            </span>
                        </Link>

                        {/* History Option */}
                        <Link
                            to="/history"
                            onClick={onClose}
                            className={`${isHistoryActive
                                ? "bg-[#FFC37B] border-[#F49B31]"
                                : "bg-transparent border-[#F49B31]"
                                } border border-solid flex gap-3 items-center px-[15px] py-[7px] rounded-[15px] w-full`}
                        >
                            <img
                                src={historyIcon}
                                alt="History"
                                className="w-[15px] h-[15px]"
                            />
                            <span className="font-semibold text-[11px] text-black font-['Poppins',sans-serif] leading-normal whitespace-nowrap">
                                History
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileOptionsDropdown;
