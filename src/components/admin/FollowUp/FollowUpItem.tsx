import React from "react";
import type { FollowUpItem as FollowUpItemType } from "./types";

interface FollowUpItemProps {
    item: FollowUpItemType;
}

const FollowUpItem: React.FC<FollowUpItemProps> = ({ item }) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-white border-[#626665] border-[1.5px]";
            case "under-review":
                return "bg-white border-[#626665] border-[1.5px]";
            case "completed":
                return "bg-white border-[#626665] border-[1.5px]";
            default:
                return "bg-white border-[#626665] border-[1.5px]";
        }
    };

    const getActionButtonStyles = (variant?: string) => {
        switch (variant) {
            case "orange":
                return "bg-[#f49b31] text-white border-none";
            case "outline-orange":
                return "bg-transparent border-[#f49b31] border-[1.5px] text-[#f49b31]";
            case "red":
                return "bg-transparent border-[#b01212] border-[1.5px] text-[#b01212]";
            default:
                return "bg-[#f49b31] text-white border-none";
        }
    };

    return (
        <div
            className="flex flex-col items-start relative shrink-0 w-full rounded-[10px] overflow-hidden"
            data-node-id={`followup-item-${item.id}`}
        >
            {/* Header with title and category */}
            <div className="bg-[#ffc37b] border-b border-l border-r border-[#f49b31] border-solid flex items-center justify-between pb-[11px] pt-2.5 px-[21px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-full">
                <div className="flex gap-2.5 items-center flex-1">
                    <h3 className="font-poppins font-semibold text-[16px] leading-[19.5px] text-black whitespace-nowrap">
                        {item.title}
                    </h3>
                    <span className="bg-[#fef5ea] border border-[#f49b31] border-solid flex items-center justify-center px-2 py-0.5 rounded-[20px] shrink-0">
                        <span className="font-poppins font-semibold text-[11px] leading-[16.5px] text-[#f49b31]">
                            {item.category}
                        </span>
                    </span>
                </div>
            </div>

            {/* Content area with gradient background */}
            <div className="bg-linear-to-r from-[#fefefe] to-[#fefefe] flex flex-col gap-[17px] items-start px-[27.5px] py-5 relative rounded-bl-[10px] rounded-br-[10px] shrink-0 w-full">
                {/* Top section: Author info and status */}
                <div className="flex items-center justify-between relative shrink-0 w-full">
                    <div className="flex gap-5 items-center">
                        <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-[53px] h-[53px] rounded-full object-cover"
                        />
                        <div className="flex flex-col items-start justify-center">
                            <h4 className="font-poppins font-semibold text-[15px] leading-normal text-black">
                                {item.author.name}
                            </h4>
                            <p className="font-poppins font-medium text-[13px] leading-normal text-[#8b8e8d]">
                                {item.author.timestamp}
                            </p>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div
                        className={`flex gap-[9px] items-center justify-center px-[16.5px] py-1.5 rounded-[23px] shrink-0 ${getStatusStyles(
                            item.status
                        )}`}
                    >
                        <div className="w-[7.5px] h-[7.5px] bg-[#626665] rounded-full" />
                        <span className="font-poppins font-medium text-[13.5px] leading-normal text-black text-right whitespace-nowrap capitalize">
                            {item.status === "under-review"
                                ? "Under Review"
                                : item.status === "approved"
                                    ? "Approved"
                                    : item.status}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col items-start relative shrink-0 w-full">
                    <p className="font-poppins font-medium text-[14px] leading-normal text-black text-justify">
                        {item.description}
                    </p>
                </div>

                {/* Bottom section: Action buttons and wave count */}
                <div className="flex items-center justify-between relative shrink-0 w-full">
                    <div className="flex gap-[15px] items-center">
                        {item.actions.primary && (
                            <button
                                onClick={item.actions.primary.onClick}
                                className={`flex gap-1.5 items-center justify-center px-[15px] py-[8.25px] rounded-[15px] font-poppins font-semibold text-[13px] leading-normal uppercase transition-all ${getActionButtonStyles(
                                    item.actions.primary.variant
                                )}`}
                            >
                                ✓ {item.actions.primary.label}
                            </button>
                        )}
                        {item.actions.secondary && (
                            <button
                                onClick={item.actions.secondary.onClick}
                                className={`flex gap-1.5 items-center justify-center px-[15px] py-[8.25px] rounded-[15px] font-poppins font-semibold text-[13px] leading-normal uppercase transition-all ${getActionButtonStyles(
                                    item.actions.secondary.variant
                                )}`}
                            >
                                ⚡ {item.actions.secondary.label}
                            </button>
                        )}
                    </div>

                    {/* Wave count */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[#f49b31] font-bold text-[20px]">⚡</span>
                        <span className="font-poppins font-semibold text-[18px] leading-normal text-[#f49b31]">
                            {item.waveCount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowUpItem;
