import React, { useState } from "react";
import AdminHeader from "../AdminHeader";
import AdminMobileMenu from "../AdminMobileMenu";
import { useUIStore } from "../../../stores";
import GeneralSettings from "./GeneralSettings";
import MemberManagement from "./MemberManagement";
import CategoryManagement from "./CategoryManagement";
import RulesSettings from "./RulesSettings";
import { motion } from "framer-motion";
import { User } from "lucide-react";

type SettingTab = "general" | "members" | "categories" | "rules";

interface AdminSettingsProps {
    onPublishAnnouncement?: () => void;
    onExport?: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onPublishAnnouncement, onExport }) => {
    const [activeTab, setActiveTab] = useState<SettingTab>("general");
    const [openMenu, setOpenMenu] = useState(false);
    const { isSidebarCollapsed } = useUIStore();

    const iconVariants = {
        initial: {
            filter: "grayscale(1) brightness(1)",
            willChange: "filter"
        },
        hover: {
            filter: "grayscale(1) brightness(1.5)",
            transition: {
                duration: 0.1,
            }
        }
    };

    const tabClass = (isActive: boolean) =>
        `flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-[12px] font-poppins font-semibold text-[13px] sm:text-[14px] border transition-all ${isActive
            ? "bg-[#f49b31] border-[#f49b31] text-white shadow-md shadow-[#f49b31]/10"
            : "bg-white border-[#ffd7a8] text-[#926b3d] hover:bg-[#fef5ea]"
        }`;

    return (
        <>
            <div className={`m-0 ${isSidebarCollapsed ? "md:ms-[80px]" : "md:ms-[230px]"} flex flex-col gap-6 items-start px-4 sm:px-8 py-6 sm:py-8 relative min-h-screen pb-24 z-0 transition-all duration-300`}>
                {/* Header Row */}
                <div className="flex flex-col gap-2 items-start relative w-full border-b border-[#ffd7a8] pb-4">
                    <div className="flex items-center justify-between w-full">
                        <h1 className="hidden md:block font-poppins font-semibold text-[24px] sm:text-[28px] leading-normal text-black">
                            Admin Settings
                        </h1>
                        <AdminHeader title="Admin Settings" setOpenMenu={setOpenMenu} openMenu={openMenu} />
                        <div className="flex gap-2">
                            {/* Export Button */}
                            <motion.button
                                onClick={onExport}
                                className="border border-[#f49b31] rounded-lg px-3 sm:px-[15px] py-2 sm:py-[9px] flex items-center gap-1 sm:gap-2 hover:bg-[#F49B31] text-[#f49b31] hover:text-white transition-colors text-xs sm:text-[12px]"
                                whileHover="hover"
                            >
                                <motion.img src="/assets/icon/Export.svg" alt="Export Icon" className="w-[13px] h-[13px]" variants={iconVariants} />
                                <span className="font-medium hidden sm:inline">
                                    Export
                                </span>
                            </motion.button>
                            {/* Publish Announcement Button */}
                            <button
                                onClick={onPublishAnnouncement}
                                className="bg-[#ffc37b] hover:bg-[#ffb347] border border-[#f49b31] rounded-lg px-3 sm:px-[15px] py-2 sm:py-[9px] flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-[12px]"
                            >
                                <img src="/assets/icon/cross.svg" alt="Announcement Icon" className="w-[13px] h-[13px]" />
                                <span className="text-[#212121] font-medium hidden sm:inline">
                                    Publish Announcement
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Settings Tabs Bar */}
                <div className="flex overflow-x-auto scrollbar-hide flex-nowrap gap-2 w-full pb-2">
                    {/* General Tab */}
                    <button
                        onClick={() => setActiveTab("general")}
                        className={tabClass(activeTab === "general")}
                    >
                        <User className="w-4 h-4 shrink-0" />
                        General
                    </button>

                    {/* Member Management Tab */}
                    <button
                        onClick={() => setActiveTab("members")}
                        className={tabClass(activeTab === "members")}
                    >
                        <img src="/assets/icon/member-management.svg" alt="Member Management Icon" className={`w-4 h-4 shrink-0 ${activeTab === "members" ? "brightness-0 invert" : ""}`} />
                        Member Management
                    </button>

                    {/* Category Management Tab */}
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={tabClass(activeTab === "categories")}
                    >
                        <img src="/assets/icon/admin-soundboard.svg" alt="Category Management Icon" className={`w-4 h-4 shrink-0 ${activeTab === "categories" ? "brightness-0 invert" : ""}`} />
                        Category Management
                    </button>

                    {/* Rules Tab */}
                    <button
                        onClick={() => setActiveTab("rules")}
                        className={tabClass(activeTab === "rules")}
                    >
                        <img src="/assets/icon/rules.svg" alt="Rules Icon" className={`w-4 h-4 shrink-0 ${activeTab === "rules" ? "brightness-0 invert" : ""}`} />
                        Rules
                    </button>
                </div>

                {/* Subpage Contents Panel */}
                <div className="relative z-10 w-full  rounded-[20px] p-5 sm:p-8 min-h-[400px]">
                    {activeTab === "general" && <GeneralSettings />}
                    {activeTab === "members" && <MemberManagement />}
                    {activeTab === "categories" && <CategoryManagement />}
                    {activeTab === "rules" && <RulesSettings />}
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            <AdminMobileMenu setMenu={setOpenMenu} menu={openMenu} />
        </>
    );
};

export default AdminSettings;
