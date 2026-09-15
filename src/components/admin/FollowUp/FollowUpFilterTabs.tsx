import React from "react";
import type { FilterType } from "./types";

interface FollowUpFilterTabsProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    counts?: Partial<Record<FilterType, number>>;
}

interface FilterTab {
    id: FilterType;
    label: string;
    icon: string;
    nodeId: string;
}

const filterDefs: FilterTab[] = [
    {
        id: "all",
        label: "All",
        icon: "/assets/icon/wave.svg",
        nodeId: "5627:16786"
    },
    {
        id: "approved-waves",
        label: "Approved Waves",
        icon: "/assets/icon/badge-check.svg",
        nodeId: "5627:16795"
    },
    {
        id: "under-review",
        label: "Waves Under Review",
        icon: "/assets/icon/awaiting-approval.svg",
        nodeId: "5627:16805"
    },
    {
        id: "acknowledged-pings",
        label: "Acknowledged Pings",
        icon: "/assets/icon/acknowledged-pings.svg",
        nodeId: "5627:16819"
    },
    {
        id: "in-progress",
        label: "Waves in Progress",
        icon: "/assets/icon/time-alert.svg",
        nodeId: "5627:16828"
    },
];

const mobileLabels: Record<string, string> = {
    "all": "All",
    "approved-waves": "Approved",
    "under-review": "Review",
    "acknowledged-pings": "Pings",
    "in-progress": "Progress"
};

const FollowUpFilterTabs: React.FC<FollowUpFilterTabsProps> = ({
    activeFilter,
    onFilterChange,
    counts = {},
}) => {
    return (
        <div
            className="flex gap-1.5 sm:gap-2.5 items-center justify-start sm:justify-center relative shrink-0 w-full overflow-x-auto pb-2 scrollbar-none"
            data-node-id="5627:16785"
        >
            {filterDefs.map((filter) => {
                const isActive = activeFilter === filter.id;
                const count = counts[filter.id] ?? 0;

                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex gap-[6px] sm:gap-[9px] items-center justify-center h-11 sm:h-[52px] px-3 sm:px-[18px] relative shrink-0 rounded-[22.5px] whitespace-nowrap transition-all text-xs sm:text-sm border-[1.8px] border-solid ${
                            isActive
                                ? "bg-[#f49b31] border-[#f49b31] hover:bg-[#e28a20]"
                                : "bg-[#fef5ea] border-[#f49b31] hover:bg-[#fdecd8]"
                        }`}
                        data-node-id={filter.nodeId}
                    >
                        <div
                            className="bg-[#fce6cc] border-[0.27px] border-[#f49b31] border-solid flex items-center justify-center relative rounded-[11.7px] w-[22px] sm:w-[25.2px] h-[22px] sm:h-[25.2px] shrink-0"
                            data-node-id={`${filter.nodeId}-icon-container`}
                        >
                            <img 
                                src={filter.icon} 
                                alt="" 
                                className="w-[11px] sm:w-[13.5px] h-[11px] sm:h-[13.5px] object-contain"
                                data-node-id={`${filter.nodeId}-icon`}
                            />
                        </div>
                        
                        <span
                            className={`font-poppins font-semibold text-[10px] sm:text-[11.7px] leading-[15px] sm:leading-[17.55px] ${
                                isActive ? "text-[#fef5ea]" : "text-black"
                            }`}
                        >
                            <span className="inline sm:hidden">{mobileLabels[filter.id]}</span>
                            <span className="hidden sm:inline">{filter.label}</span>
                        </span>
                        
                        <div
                            className={`flex flex-col items-start px-1 sm:px-[7.2px] py-px sm:py-[1.8px] rounded-[18px] border-[0.5px] border-solid shrink-0 ${
                                isActive
                                    ? "bg-[#fef5ea] border-[#f49b31] text-[#f49b31]"
                                    : "bg-[#ffc37b] border-[#f49b31] text-white"
                            }`}
                            data-node-id={`${filter.nodeId}-badge`}
                        >
                            <span className="font-dm-sans font-semibold text-[8px] sm:text-[9.9px] leading-3 sm:leading-[14.85px]">
                                {count}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default FollowUpFilterTabs;