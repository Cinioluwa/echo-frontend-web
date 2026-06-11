import React from "react";
import ViolationBadge from "./ViolationBadge";
import type { ModerationItem as ModerationItemType } from "./types";

interface ModerationItemProps {
    item: ModerationItemType;
}

const ModerationItem: React.FC<ModerationItemProps> = ({ item }) => {
    const handleTakeAction = () => {
        console.log("Take action on", item.id);
    };

    const handleDismiss = () => {
        console.log("Dismiss", item.id);
    };

    const headerText = item.type === "comment" ? "Comment on:" : item.type === "wave" ? "Wave on:" : null;

    return (
        <div className="flex flex-col items-start w-full">
            {/* Header - Orange background */}
            {headerText ? (
                <div className="bg-[#ffc37b] border border-[#f49b31] border-b-2 w-full px-5 sm:px-[21px] py-2 sm:py-2.5 flex items-center justify-start rounded-t-xl">
                    <p className="font-poppins font-bold text-[14px] sm:text-[16px] text-white whitespace-nowrap">
                        {headerText}&nbsp;
                    </p>
                    <p className="font-poppins font-semibold text-[14px] sm:text-[16px] text-black truncate">
                        {item.subject}
                    </p>
                    <div className="bg-white border border-[#f49b31] rounded-[20px] px-2 py-0.5 ml-2 shrink-0">
                        <p className="font-poppins font-semibold text-[10px] sm:text-[11px] text-[#f49b31] whitespace-nowrap">
                            {item.category}
                        </p>
                    </div>
                </div>) : null}

            {/* Content - White background */}
            <div className={`bg-white w-full px-3 sm:px-[27.5px] py-3 sm:py-5 flex flex-col gap-3 sm:gap-[17px] rounded-b-xl ${headerText ? "" : "rounded-t-xl"}`}>
                {/* Author info */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between w-full">
                    <div className="flex gap-3 items-center">
                        <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-[45px] sm:w-[53px] h-[45px] sm:h-[53px] rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="font-poppins font-semibold text-[13px] sm:text-[15px] text-black">
                                {item.author.name}
                            </p>
                            <p className="font-poppins font-medium text-[12px] sm:text-[13px] text-[#8b8e8d]">
                                {item.author.timestamp}
                            </p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <ViolationBadge type={item.violationType} />
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#e0e0e0] w-full" />

                {/* Content */}
                <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-black text-justify">
                    {item.content}
                </p>

                {/* Image if present */}
                {item.image && (
                    <img
                        src={item.image}
                        alt="Content"
                        className="w-full rounded-lg object-cover max-h-[200px]"
                    />
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-2">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleTakeAction}
                            className="bg-[#f49b31] hover:bg-[#e68a1f] text-white font-poppins font-semibold text-[11px] sm:text-[13px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                            <img src='/assets/icon/take-action.svg' alt='judge' className="w-[28px] h-[28px]" />
                            TAKE ACTION
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="bg-white border border-[#f49b31] text-[#f49b31] hover:bg-[#fef5ea] font-poppins font-semibold text-[11px] sm:text-[13px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                            <span>✕</span>
                            DISMISS
                        </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#eb5050] self-end sm:self-auto">
                        <span className="text-[18px]">🚩</span>
                        <p className="font-poppins font-semibold text-[18px] sm:text-[24px]">
                            {item.flagCount}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModerationItem;
