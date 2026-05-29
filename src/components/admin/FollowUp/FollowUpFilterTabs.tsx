import React from "react";
import type { FilterType } from "./types";

interface FollowUpFilterTabsProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

interface FilterTab {
    id: FilterType;
    label: string;
    icon: string;
    count: number;
}

const mockFilters: FilterTab[] = [
    { id: "all", label: "All", icon: "⚡", count: 16 },
    { id: "approved-waves", label: "Approved Waves", icon: "✓", count: 7 },
    { id: "under-review", label: "Waves Under Review", icon: "👁", count: 4 },
    { id: "acknowledged-pings", label: "Acknowledged Pings", icon: "👁", count: 3 },
    { id: "in-progress", label: "Waves in Progress", icon: "⚙", count: 2 },
];

const FollowUpFilterTabs: React.FC<FollowUpFilterTabsProps> = ({
    activeFilter,
    onFilterChange,
}) => {
    return (
        <div
            className="flex gap-1.5 sm:gap-2.5 items-center justify-start sm:justify-center relative shrink-0 w-full overflow-x-auto pb-2"
            data-node-id="5627:17546"
        >
            {mockFilters.map((filter) => {
                const isActive = activeFilter === filter.id;
                // Mobile: show abbreviated labels
                const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;
                const mobileLabels: Record<string, string> = {
                    "all": "All",
                    "approved-waves": "Approved",
                    "under-review": "Review",
                    "acknowledged-pings": "Pings",
                    "in-progress": "Progress"
                };
                const displayLabel = isMobileView ? mobileLabels[filter.id] : filter.label;

                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex gap-1 sm:gap-2.5 items-center justify-center px-2.5 sm:px-4.5 py-1.5 sm:py-2.25 relative shrink-0 rounded-[22.5px] whitespace-nowrap transition-all text-xs sm:text-sm ${isActive
                            ? "bg-[#f49b31] border-[#f49b31] border-[1.8px]"
                            : "bg-[#fef5ea] border-[#f49b31] border-[1.8px]"
                            }`}
                        data-node-id={`filter-${filter.id}`}
                    >
                        <div
                            className={`flex items-center justify-center rounded-[11.7px] w-[22px] sm:w-[25.2px] h-[22px] sm:h-[25.2px] border-[0.27px] shrink-0 ${isActive
                                ? "bg-[#fce6cc] border-[#f49b31]"
                                : "bg-[#fce6cc] border-[#f49b31]"
                                }`}
                        >
                            <span className="text-[11px] sm:text-[13.5px]">{filter.icon}</span>
                        </div>
                        <span
                            className={`font-poppins font-semibold text-[10px] sm:text-[11.7px] leading-[15px] sm:leading-[17.55px] hidden xs:inline ${isActive ? "text-[#fef5ea]" : "text-black"
                                }`}
                        >
                            {displayLabel}
                        </span>
                        <div
                            className={`flex items-center justify-center px-[5px] sm:px-[7.2px] py-px sm:py-[1.8px] rounded-[18px] border-[0.5px] shrink-0 ${isActive
                                ? "bg-[#fef5ea] border-[#fef5ea] text-[#f49b31]"
                                : "bg-[#ffc37b] border-[#f49b31] text-white"
                                }`}
                        >
                            <span className="font-dm-sans font-semibold text-[8px] sm:text-[9.9px] leading-3 sm:leading-[14.85px]">
                                {filter.count}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default FollowUpFilterTabs;
