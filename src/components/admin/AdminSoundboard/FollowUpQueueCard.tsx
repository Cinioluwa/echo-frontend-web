import React from "react";

export interface FollowUpItem {
    id: string;
    title: string;
    description: string;
    count: number;
    iconColor: "red" | "green" | "orange"; // Background color for icon
    icon?: string; // URL to icon image
    onClick?: () => void;
}

interface FollowUpQueueCardProps {
    items: FollowUpItem[];
    pendingCount: number;
    className?: string;
}

const FollowUpQueueCard: React.FC<FollowUpQueueCardProps> = ({
    items,
    pendingCount,
    className = "",
}) => {
    const iconColorClasses = {
        red: "bg-[#f6c0c0]",
        green: "bg-[#c8e6c9]",
        orange: "bg-[#ffe0b2]",
    };

    return (
        <a
            className={`bg-white border border-[rgba(244,155,49,0.3)] rounded-xl p-5 flex flex-col gap-[15px] cursor-pointer hover:border-[rgba(244,155,49,0.5)] transition-all ${className}`}
            data-node-id="followup-queue-card"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-[#212121] font-semibold text-[18px] leading-[19.5px] uppercase tracking-[-0.1px]">
                    Follow-up Queue
                </h3>
                <div className="bg-[#f49b31] rounded-[20px] px-2.5 py-[3px] flex items-center">
                    <span className="text-[#fef5ea] font-medium text-[11px] leading-[16.5px] whitespace-nowrap">
                        {pendingCount} pending
                    </span>
                </div>
            </div>

            {/* Follow-up Items List */}
            <div className="flex flex-col gap-2 overflow-y-auto">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#fef5ea] border border-[#f49b31] rounded-[9px] px-[12.5px] py-[10.5px] flex gap-2.5 items-center"
                    >
                        {/* Icon */}
                        <div
                            className={`${iconColorClasses[item.iconColor]} rounded-[7px] w-7 h-7 flex items-center justify-center shrink-0 mt-px`}
                        >
                            {item.icon ? (
                                <img src={item.icon} alt={item.title} className="w-8/2 h-8/12 " />
                            ) : null}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col min-w-0 gap-1 me-auto">
                            <p className="text-[#212121] font-medium text-[12px] leading-[18px]">
                                {item.title}
                            </p>
                            <p className="text-[#5e5c58] font-normal text-[11px] leading-[16.5px]">
                                {item.description}
                            </p>
                        </div>

                        {/* Count Badge */}
                        <div className="bg-[#f6c0c0] border border-[#b01212] rounded-full shrink-0 flex items-center justify-center px-2 py-1">
                            <span className="text-[#b01212] font-semibold text-[11px] whitespace-nowrap h-fit ">
                                {item.count}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </a>
    );
};

export default FollowUpQueueCard;
