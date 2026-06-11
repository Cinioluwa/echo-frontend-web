import React, { useState } from "react";
import StatCard from "./StatCard";
import SurgeAlertCard, { type SurgeItem } from "./SurgeAlertCard";
import FollowUpQueueCard, { type FollowUpItem } from "./FollowUpQueueCard";
import IssuesByCategoryCard, { type CategoryData } from "./IssuesByCategoryCard";
import { motion } from "framer-motion";
import AdminHeader from "../AdminHeader";
import AdminMobileMenu from "../AdminMobileMenu";

interface AdminSoundboardProps {
    onPublishAnnouncement?: () => void;
    onExport?: () => void;
}

// Mock data - replace with actual API calls
const mockSurgeItems: SurgeItem[] = [
    {
        id: "1",
        title: "The wifi is too slow in library",
        velocity: "+42 surges/hr",
        category: "General",
    },
    {
        id: "2",
        title: "No water in the halls since Monday",
        velocity: "+29 surges/hr",
        category: "Hall",
    },
    {
        id: "3",
        title: "Shuttles to EIE",
        velocity: "+22 surges/hr",
        category: "Welfare",
    },
];

const mockFollowUpItems: FollowUpItem[] = [
    {
        id: "1",
        title: "Approved waves not being implemented",
        description: "7 approved waves require progression",
        count: 7,
        iconColor: "red",
        icon: "/assets/icon/not-implemented.svg"
    },
    {
        id: "2",
        title: "Waves awaiting approval",
        description: "4 waves marked for review need a decision",
        count: 4,
        iconColor: "red",
        icon: "/assets/icon/awaiting-approval.svg"
    },
    {
        id: "3",
        title: "Acknowledged pings stalling",
        description: "3 pings acknowledged, no update for 14+ days",
        count: 3,
        iconColor: "green",
        icon: "/assets/icon/acknowledged-pings.svg"
    },
];

const mockCategories: CategoryData[] = [
    {
        name: "General",
        resolved: 79,
        openCount: 14,
        issues: [
            {
                id: "1",
                title: "Wifi too slow across campus",
                postedTime: "Posted 1d ago",
                count: 1204,
            },
            {
                id: "2",
                title: "Bus schedule inconsistency",
                postedTime: "Posted 1d ago",
                count: 527,
            },
        ],
    },
    {
        name: "Hall",
        resolved: 30,
        openCount: 23,
        issues: [
            {
                id: "1",
                title: "No water in Deborah Hall",
                postedTime: "Posted 1d ago",
                count: 842,
            },
            {
                id: "2",
                title: "Broken lockers in Daniel Hall",
                postedTime: "Posted 1d ago",
                count: 411,
            },
        ],
    },
    {
        name: "Academics",
        resolved: 67,
        openCount: 9,
        issues: [
            {
                id: "1",
                title: "Library hours extended during finals",
                postedTime: "Posted 1d ago",
                count: 256,
            },
        ],
    },
    {
        name: "Finance",
        resolved: 85,
        openCount: 3,
        issues: [
            {
                id: "1",
                title: "Student loan interest rate changes",
                postedTime: "Posted 1d ago",
                count: 345,
            },
        ],
    },
];

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

const AdminSoundboard: React.FC<AdminSoundboardProps> = ({
    onPublishAnnouncement,
    onExport,
}) => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            <div className="flex min-h-screen bg-[#fae9d4] m-0 md:ms-[230px]" data-node-id="admin-soundboard-page">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <div className="px-3 sm:px-5 pt-5 sm:pt-[30px] pb-3 sm:pb-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                            {/* Title Section */}
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <h1 className="hidden md:block text-[#212121] font-semibold text-[24px] sm:text-[28px] leading-[26px] sm:leading-[30.8px] tracking-[-0.5px]">
                                    Soundboard
                                </h1>
                                <AdminHeader title="Soundboard" setOpenMenu={setOpenMenu} openMenu={openMenu} />
                                <p className="text-[#5e5c58] font-medium text-[13px] sm:text-[15px] leading-4 sm:leading-[18px]">
                                    Covenant University · Week of July 15  21, 2024
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
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

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-5 sm:py-[30px]">
                        <div className="flex flex-col gap-[30px] max-w-[1200px]">
                            {/* Critical Section - Surge Alert and Follow-up Queue */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <SurgeAlertCard
                                    count={3}
                                    items={mockSurgeItems}
                                    className="lg:col-span-1"
                                />
                                <FollowUpQueueCard
                                    items={mockFollowUpItems}
                                    pendingCount={16}
                                    className="lg:col-span-1"
                                />
                            </div>

                            {/* Stats Section */}
                            <div className="flex flex-wrap sm:flex-nowrap gap-5 ">
                                <StatCard
                                    title="Resolution Rate"
                                    value="64%"
                                    subtitle="*Of pings resolved"
                                    badge={{ label: "↑ 8% this month", color: "green" }}
                                />
                                <StatCard
                                    title="Average Resolution Time"
                                    value="3.2 days"
                                    subtitle="*Days to resolve"
                                    badge={{ label: "↓ 0.5d improvement", color: "green" }}
                                />
                                <StatCard
                                    title="Overdue (>7D)"
                                    value="38"
                                    subtitle="*Need attention"
                                    badge={{ label: "↑ +12 this week", color: "red" }}
                                />
                            </div>

                            {/* Issues by Category Section */}
                            <IssuesByCategoryCard categories={mockCategories} />
                        </div>
                    </div>
                </div>
            </div>
            <AdminMobileMenu setMenu={setOpenMenu} menu={openMenu} />
        </>
    );
};

export default AdminSoundboard;
