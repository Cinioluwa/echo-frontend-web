import React, { useState } from "react";
import StatCard from "./StatCard";
import SurgeAlertCard, { type SurgeItem } from "./SurgeAlertCard";
import FollowUpQueueCard, { type FollowUpItem } from "./FollowUpQueueCard";
import IssuesByCategoryCard, { type CategoryData } from "./IssuesByCategoryCard";
import AdminSoundboardSidebar from "./AdminSoundboardSidebar";

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
    },
    {
        id: "2",
        title: "Waves awaiting approval",
        description: "4 waves marked for review need a decision",
        count: 4,
        iconColor: "red",
    },
    {
        id: "3",
        title: "Acknowledged pings stalling",
        description: "3 pings acknowledged, no update for 14+ days",
        count: 3,
        iconColor: "green",
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

const AdminSoundboard: React.FC<AdminSoundboardProps> = ({
    onPublishAnnouncement,
    onExport,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-[#fae9d4]" data-node-id="admin-soundboard-page">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="hidden md:block">
                    <AdminSoundboardSidebar
                        userName="Osagumwenro Ugbo"
                        userBadge="ADMIN.CU"
                        onToggleSidebar={() => setSidebarOpen(false)}
                        onSoundboardClick={() => { }}
                    />
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="bg-white border-b border-[rgba(244,155,49,0.3)] px-3 sm:px-5 pt-5 sm:pt-[30px] pb-3 sm:pb-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                        {/* Title Section */}
                        <div className="flex flex-col gap-1 sm:gap-2">
                            <h1 className="text-[#212121] font-semibold text-[24px] sm:text-[28px] leading-[26px] sm:leading-[30.8px] tracking-[-0.5px]">
                                Soundboard
                            </h1>
                            <p className="text-[#5e5c58] font-medium text-[13px] sm:text-[15px] leading-4 sm:leading-[18px]">
                                Covenant University · Week of July 15  21, 2024
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                            {/* Export Button */}
                            <button
                                onClick={onExport}
                                className="border border-[#f49b31] rounded-2 px-3 sm:px-[15px] py-2 sm:py-[9px] flex items-center gap-1 sm:gap-2 hover:bg-[#fef5ea] transition-colors text-xs sm:text-[12px]"
                            >
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" />
                                    <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="text-[#f49b31] font-medium hidden sm:inline">
                                    Export
                                </span>
                            </button>

                            {/* Publish Announcement Button */}
                            <button
                                onClick={onPublishAnnouncement}
                                className="bg-[#ffc37b] hover:bg-[#ffb347] border border-[#f49b31] rounded-2 px-3 sm:px-[15px] py-2 sm:py-[9px] flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-[12px]"
                            >
                                <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                </svg>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
    );
};

export default AdminSoundboard;
