import React from "react";
import type { RelatedPing } from "./types";

interface RelatedPingsProps {
    pings: RelatedPing[];
}

const RelatedPings: React.FC<RelatedPingsProps> = ({ pings }) => {
    const getCategoryColor = (category: string): string => {
        const colors: Record<string, string> = {
            "Chapel": "bg-[#ffc37b] text-white",
            "Hall": "bg-[#ffc37b] text-white",
            "Academic": "bg-[#ffc37b] text-white",
        };
        return colors[category] || "bg-[#ffc37b] text-white";
    };

    return (
        <div className="bg-white border border-[rgba(244,155,49,0.2)] rounded-xl p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
            <h3 className="font-poppins font-semibold text-[16px] sm:text-[18px] text-black">
                Related Pings
            </h3>
            <div className="flex flex-col gap-2 sm:gap-3">
                {pings.map((ping) => (
                    <div
                        key={ping.id}
                        className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-[#fef5ea] rounded-lg hover:bg-[#fef5ea]/80 transition-colors cursor-pointer"
                    >
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-lg font-poppins font-semibold text-[10px] sm:text-[11px] whitespace-nowrap shrink-0 ${getCategoryColor(ping.category)}`}>
                                    {ping.category}
                                </span>
                            </div>
                            <p className="font-poppins font-semibold text-[11px] sm:text-[13px] text-black truncate">
                                {ping.title}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[14px]">⚡</span>
                            <p className="font-poppins font-semibold text-[12px] sm:text-[14px] text-[#f49b31] whitespace-nowrap">
                                {ping.waveCount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedPings;
