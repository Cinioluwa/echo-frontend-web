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
            className="flex gap-2.5 items-center justify-center relative shrink-0 w-full overflow-x-auto pb-2"
            data-node-id="5627:17546"
        >
            {mockFilters.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex gap-2.5 items-center justify-center px-4.5 py-2.25 relative shrink-0 rounded-[22.5px] whitespace-nowrap transition-all ${isActive
                            ? "bg-[#f49b31] border-[#f49b31] border-[1.8px]"
                            : "bg-[#fef5ea] border-[#f49b31] border-[1.8px]"
                            }`}
                        data-node-id={`filter-${filter.id}`}
                    >
                        <div
                            className={`flex items-center justify-center rounded-[11.7px] w-[25.2px] h-[25.2px] border-[0.27px] ${isActive
                                ? "bg-[#fce6cc] border-[#f49b31]"
                                : "bg-[#fce6cc] border-[#f49b31]"
                                }`}
                        >
                            <span className="text-[13.5px]">{filter.icon}</span>
                        </div>
                        <span
                            className={`font-poppins font-semibold text-[11.7px] leading-[17.55px] ${isActive ? "text-[#fef5ea]" : "text-black"
                                }`}
                        >
                            {filter.label}
                        </span>
                        <div
                            className={`flex items-center justify-center px-[7.2px] py-[1.8px] rounded-[18px] border-[0.5px] ${isActive
                                ? "bg-[#fef5ea] border-[#fef5ea] text-[#f49b31]"
                                : "bg-[#ffc37b] border-[#f49b31] text-white"
                                }`}
                        >
                            <span className="font-dm-sans font-semibold text-[9.9px] leading-[14.85px]">
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
