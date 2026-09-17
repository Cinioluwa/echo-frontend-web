import React, { useState } from "react";
import type { Wave } from "../../../api/types/index";
import AdminWaveCard from "./AdminWaveCard";

interface AdminPingWavesProps {
    waves: Wave[];
    onUpdateWaveStatus: (id: number, status: "APPROVED" | "REJECTED" | "UNDER_REVIEW", reason?: string) => Promise<void>;
}

// All displayable tabs — matches Wave Indicators Figma spec (node 4291:9699)
type Tab = "All" | "Proposed" | "Under Review" | "Approved" | "Rejected" | "In Progress" | "Completed";

const TABS: Tab[] = ["All", "Proposed", "Under Review", "Approved", "In Progress", "Rejected", "Completed"];

const TAB_STATUSES: Record<Tab, string[] | null> = {
    "All": null, // null = no filter
    "Proposed": ["POSTED"],
    "Under Review": ["UNDER_REVIEW"],
    "Approved": ["APPROVED"],
    "In Progress": ["IN_PROGRESS"],
    "Rejected": ["REJECTED"],
    "Completed": ["COMPLETED"],
};

const AdminPingWaves: React.FC<AdminPingWavesProps> = ({ waves, onUpdateWaveStatus }) => {
    const [activeTab, setActiveTab] = useState<Tab>("All");

    // Sort by surge count descending — spread first to avoid mutating the original array
    const sortedWaves = [...waves].sort((a, b) => b.surgeCount - a.surgeCount);

    const statusFilter = TAB_STATUSES[activeTab];
    const currentWaves = statusFilter
        ? sortedWaves.filter(w => statusFilter.includes(w.status))
        : sortedWaves;

    const countForTab = (tab: Tab): number => {
        const statuses = TAB_STATUSES[tab];
        if (!statuses) return waves.length;
        return waves.filter(w => statuses.includes(w.status)).length;
    };

    // Only show tabs that have content, plus All
    const visibleTabs = TABS.filter(tab => tab === "All" || countForTab(tab) > 0);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h2 className="font-poppins font-bold text-[18px] md:text-[20px] text-black">
                    Waves
                </h2>
                <span className="font-poppins text-[12px] text-[#8b8e8d]">
                    {waves.length} total
                </span>
            </div>

            {/* Tab bar — scrollable on mobile */}
            <div className="flex gap-1 border-b border-[#e0e0e0] overflow-x-auto scrollbar-hide pb-0">
                {visibleTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            flex-shrink-0 pb-2.5 px-3 font-poppins font-semibold text-[13px] whitespace-nowrap
                            transition-colors border-b-2
                            ${activeTab === tab
                                ? "border-[#f49b31] text-[#f49b31]"
                                : "border-transparent text-[#8b8e8d] hover:text-[#212121]"
                            }
                        `}
                    >
                        {tab}
                        {tab !== "All" && (
                            <span className={`ml-1 text-[11px] ${activeTab === tab ? "text-[#f49b31]" : "text-[#c0c0c0]"}`}>
                                ({countForTab(tab)})
                            </span>
                        )}
                        {tab === "All" && (
                            <span className={`ml-1 text-[11px] ${activeTab === tab ? "text-[#f49b31]" : "text-[#c0c0c0]"}`}>
                                ({waves.length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Wave cards */}
            <div className="flex flex-col gap-3">
                {currentWaves.length === 0 ? (
                    <p className="font-poppins text-[13px] text-[#8b8e8d] py-6 text-center">
                        No waves in this category yet.
                    </p>
                ) : (
                    currentWaves.map(wave => (
                        <AdminWaveCard
                            key={wave.id}
                            wave={wave}
                            onUpdateStatus={onUpdateWaveStatus}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPingWaves;
