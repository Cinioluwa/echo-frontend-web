import React, { useState } from "react";
import AdminHeader from "../AdminHeader";
import { useUIStore } from "../../../stores";
import GeneralSettings from "./GeneralSettings";
import MemberManagement from "./MemberManagement";
import RulesSettings from "./RulesSettings";
import { User } from "lucide-react";

type SettingTab = "general" | "members" | "rules";

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingTab>("general");
    const { isSidebarCollapsed } = useUIStore();

    const tabClass = (isActive: boolean) =>
        `flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-[12px] font-poppins font-semibold text-[13px] sm:text-[14px] border transition-all ${isActive
            ? "bg-[#f49b31] border-[#f49b31] text-white shadow-md shadow-[#f49b31]/10"
            : "bg-white border-[#ffd7a8] text-[#926b3d] hover:bg-[#fef5ea]"
        }`;

    return (
        <>
            <div className={`m-0 min-w-0 ${isSidebarCollapsed ? "min-[1131px]:ms-[102px]" : "min-[1131px]:ms-[230px]"} flex flex-col gap-6 items-start px-4 sm:px-8 py-6 sm:py-8 relative min-h-screen pb-24 z-0 transition-all duration-300`}>
                {/* Header Row */}
                <div className="flex flex-col gap-2 items-start relative w-full border-b border-[#ffd7a8] pb-4">
                    <div className="flex w-full flex-col items-start gap-1 sm:gap-2">
                        <h1 className="hidden min-[1131px]:block font-poppins font-bold text-[24px] sm:text-[32px] leading-normal text-black">
                            Admin Settings
                        </h1>
                        <AdminHeader title="Admin Settings" />
                        <p className="font-poppins font-medium text-[13px] sm:text-[16px] leading-normal text-[#8b8e8d]">
                            Manage your institution’s members, categories, and administrative preferences.
                        </p>
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
                <div className="relative z-10 min-w-0 w-full rounded-[20px] p-5 sm:p-8 min-h-[400px]">
                    {activeTab === "general" && <GeneralSettings />}
                    {activeTab === "members" && <MemberManagement />}
                    {activeTab === "rules" && <RulesSettings />}
                </div>
            </div>
        </>
    );
};

export default AdminSettings;
