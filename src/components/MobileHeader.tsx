/**
 * MobileHeader
 * Figma ref: 3912:9552 (Feed header area), 4183:13566 (History header area)
 * Phase: 1
 *
 * Replaces PageTitleBar.tsx. Structure:
 * - Left: Hamburger icon + page title ("Feed" or "History")
 * - Below title: "Category: ALL" pill (opens MobileCategoryDropdown)
 * - Right: Orange "Create Ping" button with + icon
 */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import MobileCategoryDropdown from "./MobileCategoryDropdown";
import MobileOptionsDropdown from "./MobileOptionsDropdown";
import PingFormModal from "./PingFormModal";

const menuBar = "/assets/images/menu-hotdog.svg";

const MobileHeader = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openCat, setOpenCat] = useState(false);
    const [showPingForm, setShowPingForm] = useState(false);
    const [selectedMobileCat, setSelectedMobileCat] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const isFeedPage = location.pathname === "/feed";
    const isPingDetail =
        location.pathname !== "/feed" && location.pathname.startsWith("/feed/");
    const isHistoryPage = location.pathname.startsWith("/history");
    const pageTitle = isHistoryPage ? "History" : "Feed";

    return (
        <div className="flex justify-between items-center mx-[15px] mt-[15px]">
            {/* Left side: Hamburger + Title + Category pill */}
            <div className="flex flex-col gap-2.5 items-start justify-center">
                {/* Menu identifier line */}
                <div className="flex gap-[7px] items-center justify-center">
                    <button
                        className="cursor-pointer h-3 w-5"
                        onClick={() => setOpenMenu(!openMenu)}
                    >
                        <img
                            src={menuBar}
                            alt="menu"
                            className="w-full h-full object-contain"
                        />
                    </button>
                    <span className="font-semibold text-[clamp(12px,3vw,13px)] text-black font-['Poppins',sans-serif] leading-normal">
                        {pageTitle}
                    </span>
                </div>

                {/* Back button (history) OR Back button (ping detail) OR Category pill (feed) */}
                <div className="flex items-center gap-2">
                    {(isHistoryPage || isPingDetail) ? (
                        /* Back button — shown on History and Ping Detail pages */
                        <button
                            onClick={() => navigate(isHistoryPage ? "/feed" : "/feed")}
                            className="flex items-center gap-1 bg-[#fefefe] border border-[#D0D0D0] rounded-[18px] px-2 py-[5px] h-[25px] w-[59px] cursor-pointer"
                        >
                            <span className="text-[10px] font-medium font-['Poppins',sans-serif] text-black leading-normal whitespace-nowrap">
                                ← Back
                            </span>
                        </button>
                    ) : (
                        /* Category pill — shown on main feed page only */
                        <button
                            onClick={() => setOpenCat(!openCat)}
                            className="flex items-center justify-center px-2.5 md:px-[13px] py-[3px] h-5 w-auto min-w-[84px] max-w-[120px] border border-[#7D7D7D] rounded-[25px] cursor-pointer"
                        >
                            <span className="text-[clamp(8px,2.2vw,9px)] font-medium font-['Poppins',sans-serif] text-black leading-normal whitespace-nowrap">
                                Category :{" "}
                                <span className="text-[#F49B31]">
                                    {selectedMobileCat || "ALL"}
                                </span>
                            </span>
                        </button>
                    )}
                </div>

                {/* Category dropdown overlay — only on main feed page */}
                {openCat && isFeedPage && (
                    <div
                        onClick={() => setOpenCat(false)}
                        className="fixed z-10 transition-opacity duration-300 ease-in inset-0 bg-black/40"
                    >
                        <MobileCategoryDropdown
                            selectedMobileCat={selectedMobileCat}
                            setOpenCat={setOpenCat}
                            setSelectedMobileCat={(cat) => setSelectedMobileCat(cat)}
                        />
                    </div>
                )}
            </div>

            {/* Right side: Create Ping button */}
            {!isFeedPage && (
                <button
                    onClick={() => setShowPingForm(true)}
                    className="flex items-center justify-center gap-2 bg-[#F49B31] hover:bg-[#d88429] transition-colors rounded-[25px] px-3 py-2 cursor-pointer"
                >
                    <FaPlus className="w-3 h-3 text-white" />
                    <span className="text-[clamp(10px,2.5vw,11px)] font-medium text-white font-['Poppins',sans-serif] leading-normal whitespace-nowrap">
                        Create Ping
                    </span>
                </button>)}

            {/* Mobile Options Dropdown */}
            <MobileOptionsDropdown
                isOpen={openMenu}
                onClose={() => setOpenMenu(false)}
            />

            {/* Ping Form Modal */}
            {showPingForm && (
                <PingFormModal setPingForm={() => setShowPingForm(false)} />
            )}
        </div>
    );
};

export default MobileHeader;
